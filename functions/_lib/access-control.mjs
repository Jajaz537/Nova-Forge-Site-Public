export const FOUNDER_PERMISSION = 'modaryx:founder';
export const ADMIN_PERMISSION = 'modaryx:admin';
export const ADMIN_CONSOLE_PERMISSION = 'administration:access';
export const MODERATION_PERMISSION = 'community:moderate';
export const APPEALS_REVIEW_PERMISSION = 'community:appeals-review';

const CURRENT_PRODUCT_PERMISSIONS = new Set([
  FOUNDER_PERMISSION,
  ADMIN_PERMISSION,
  ADMIN_CONSOLE_PERMISSION,
  MODERATION_PERMISSION,
  APPEALS_REVIEW_PERMISSION
]);

const ADMIN_IMPLIED_PERMISSIONS = new Set([
  ADMIN_PERMISSION,
  ADMIN_CONSOLE_PERMISSION,
  MODERATION_PERMISSION,
  APPEALS_REVIEW_PERMISSION
]);

function permissionSet(identity = {}) {
  return new Set(
    Array.isArray(identity.permissions)
      ? identity.permissions.filter((item) => typeof item === 'string' && item)
      : []
  );
}

export function hasPermission(identity, permission) {
  if (typeof permission !== 'string' || !permission) return false;
  const permissions = permissionSet(identity);
  if (permissions.has(permission)) return true;

  if (permissions.has(FOUNDER_PERMISSION)) {
    return CURRENT_PRODUCT_PERMISSIONS.has(permission);
  }

  if (permissions.has(ADMIN_PERMISSION)) {
    return ADMIN_IMPLIED_PERMISSIONS.has(permission);
  }

  return false;
}

export function authorityForIdentity(identity = {}) {
  const permissions = permissionSet(identity);

  let role = 'member';
  let level = 10;
  if (permissions.has(FOUNDER_PERMISSION)) {
    role = 'founder';
    level = 100;
  } else if (permissions.has(ADMIN_PERMISSION)) {
    role = 'administrator';
    level = 80;
  } else if (permissions.has(MODERATION_PERMISSION)) {
    role = 'moderator';
    level = 50;
  } else if (permissions.has(APPEALS_REVIEW_PERMISSION)) {
    role = 'appeals-reviewer';
    level = 45;
  }

  return {
    role,
    level,
    capabilities: {
      founder: role === 'founder',
      administration: hasPermission(identity, ADMIN_CONSOLE_PERMISSION),
      moderation: hasPermission(identity, MODERATION_PERMISSION),
      appealsReview: hasPermission(identity, APPEALS_REVIEW_PERMISSION)
    }
  };
}

export function publicAuthoritySummary(identity = {}) {
  const authority = authorityForIdentity(identity);
  return {
    role: authority.role,
    level: authority.level,
    capabilities: authority.capabilities
  };
}
