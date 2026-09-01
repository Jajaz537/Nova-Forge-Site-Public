(() => {
  "use strict";

  const stableKey = (value) => {
    if (Array.isArray(value)) return `[${value.map(stableKey).join(",")}]`;
    if (value && typeof value === "object") {
      return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableKey(value[key])}`).join(",")}}`;
    }
    return JSON.stringify(value);
  };

  function resolveRef(root, ref) {
    if (typeof ref !== "string" || !ref.startsWith("#/")) return null;
    return ref.slice(2).split("/").map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~")).reduce((node, part) => node?.[part], root);
  }

  function typeMatches(expected, value) {
    if (Array.isArray(expected)) return expected.some((item) => typeMatches(item, value));
    if (expected === "null") return value === null;
    if (expected === "array") return Array.isArray(value);
    if (expected === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
    if (expected === "integer") return Number.isInteger(value);
    if (expected === "number") return typeof value === "number" && Number.isFinite(value);
    return typeof value === expected;
  }

  function checkFormat(format, value) {
    if (format === "date-time") return typeof value === "string" && !Number.isNaN(Date.parse(value)) && /T/.test(value);
    if (format === "uri") {
      if (typeof value !== "string") return false;
      try { return Boolean(new URL(value).protocol); } catch { return false; }
    }
    return true;
  }

  function validateNode(schema, value, path, root, errors) {
    if (!schema || typeof schema !== "object") return;
    if (schema.$ref) {
      const target = resolveRef(root, schema.$ref);
      if (!target) errors.push(`${path}: référence de schéma introuvable ${schema.$ref}`);
      else validateNode(target, value, path, root, errors);
      return;
    }

    if (schema.const !== undefined && stableKey(value) !== stableKey(schema.const)) errors.push(`${path}: valeur attendue ${JSON.stringify(schema.const)}`);
    if (Array.isArray(schema.enum) && !schema.enum.some((candidate) => stableKey(candidate) === stableKey(value))) errors.push(`${path}: valeur hors enum`);
    if (schema.type !== undefined && !typeMatches(schema.type, value)) {
      errors.push(`${path}: type invalide`);
      return;
    }

    if (typeof value === "string") {
      if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}: longueur minimale ${schema.minLength}`);
      if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${path}: longueur maximale ${schema.maxLength}`);
      if (schema.pattern) {
        try { if (!new RegExp(schema.pattern).test(value)) errors.push(`${path}: format invalide`); }
        catch { errors.push(`${path}: pattern de schéma invalide`); }
      }
      if (schema.format && !checkFormat(schema.format, value)) errors.push(`${path}: format ${schema.format} invalide`);
    }

    if (typeof value === "number" && schema.minimum !== undefined && value < schema.minimum) errors.push(`${path}: minimum ${schema.minimum}`);

    if (Array.isArray(value)) {
      if (schema.uniqueItems) {
        const keys = value.map(stableKey);
        if (keys.length !== new Set(keys).size) errors.push(`${path}: éléments dupliqués`);
      }
      if (schema.items) value.forEach((entry, index) => validateNode(schema.items, entry, `${path}[${index}]`, root, errors));
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const properties = schema.properties || {};
      for (const required of schema.required || []) {
        if (!Object.prototype.hasOwnProperty.call(value, required)) errors.push(`${path}.${required}: champ requis`);
      }
      for (const [key, entry] of Object.entries(value)) {
        if (properties[key]) validateNode(properties[key], entry, `${path}.${key}`, root, errors);
        else if (schema.additionalProperties === false) errors.push(`${path}.${key}: propriété non autorisée`);
      }
    }

    for (const nested of schema.allOf || []) validateNode(nested, value, path, root, errors);
    if (schema.if) {
      const probe = [];
      validateNode(schema.if, value, path, root, probe);
      if (probe.length === 0 && schema.then) validateNode(schema.then, value, path, root, errors);
      if (probe.length !== 0 && schema.else) validateNode(schema.else, value, path, root, errors);
    }
  }

  function validate(schema, value) {
    const errors = [];
    validateNode(schema, value, "$", schema, errors);
    return errors;
  }

  window.NovaJsonSchemaLite = Object.freeze({validate});
})();
