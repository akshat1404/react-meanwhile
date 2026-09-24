import { isValidElement, type CSSProperties, type ReactNode } from 'react';

/**
 * Keeps mounted children out of layout and view while a placeholder shows.
 * Unlike display:none, this still lets them be measured.
 */
export const hiddenContainerStyle: CSSProperties = {
  visibility: 'hidden',
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none',
};

/**
 * Default cache key, derived from the children's component type. Every
 * instance of the same component shares it, so repeated instances need an
 * explicit `cacheKey` (see the cache gotcha in CLAUDE.md).
 */
export function deriveCacheKey(children: ReactNode): string {
  if (isValidElement(children)) {
    const type = children.type;
    if (typeof type === 'string') return type;
    const named = type as { displayName?: string; name?: string };
    return named.displayName ?? named.name ?? 'anonymous';
  }
  return 'fragment';
}
