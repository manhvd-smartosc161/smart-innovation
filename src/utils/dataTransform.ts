/**
 * Data transformation utility functions
 *
 * Provides helpers for transforming data structures, arrays, and objects.
 */

/**
 * Sort array of objects by a key
 *
 * @example
 * ```typescript
 * const users = [{ id: 3 }, { id: 1 }, { id: 2 }];
 * const sorted = sortBy(users, 'id', 'asc'); // [{ id: 1 }, { id: 2 }, { id: 3 }]
 * ```
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};
