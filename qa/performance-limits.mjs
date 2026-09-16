// Project-specific static budgets, not measured user performance or CWV.
export const limits = Object.freeze({precache: 800000, cssPerPage: 70000, jsPerPage: 30000});
export function budgetChecks(precache, pages) {
  const check = (name, actualBytes, limitBytes) => ({
    name, actualBytes, limitBytes,
    passed: Number.isSafeInteger(actualBytes) && actualBytes >= 0 && actualBytes <= limitBytes
  });
  return [
    check('Unique precache bytes', precache.rawBytes, limits.precache),
    {name: 'Page inventory is nonempty', passed: pages.length > 0},
    ...pages.flatMap(page => [
      check(`${page.page}: direct CSS`, page.css?.rawBytes, limits.cssPerPage),
      check(`${page.page}: direct JS`, page.js?.rawBytes, limits.jsPerPage)
    ])
  ];
}
