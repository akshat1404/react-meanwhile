import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { measureContainer } from '../shared/measure';
import { createShapeCache } from '../shared/cache';
import { deriveCacheKey, hiddenContainerStyle } from '../shared/utils';
import { Spinner } from './Spinner';

// Separate from skeleton's cache so the same cacheKey string can be used
// with both loader types without one overwriting the other.
export const spinnerCache = createShapeCache<{ width: number; height: number }>();

const FALLBACK_SIZE = { width: 120, height: 40 };

export interface SpinnerLoaderProps {
  loading: boolean;
  children: ReactNode;
  /**
   * Overrides the auto-derived cache key. Same rule as the skeleton loader:
   * the default is the children's component type, so repeated instances of
   * one component need an explicit key each.
   */
  cacheKey?: string;
  size?: number;
  color?: string;
}

/**
 * Children stay mounted regardless of `loading` (only visibility toggles),
 * same as SkeletonLoader. Only the container's overall bounding box is
 * cached: the spinner reserves exactly that footprint, so nothing shifts
 * when loading flips to false.
 */
export function SpinnerLoader({ loading, children, cacheKey, size, color }: SpinnerLoaderProps) {
  const key = cacheKey ?? deriveCacheKey(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cached, setCached] = useState(() => spinnerCache.get(key));

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { bounds } = measureContainer(container);
    if (bounds.width === 0 && bounds.height === 0) return;

    spinnerCache.set(key, bounds);
    setCached(bounds);
  }, [key, children]);

  const box = cached ?? FALLBACK_SIZE;

  return (
    <div style={{ position: 'relative' }}>
      <div ref={containerRef} style={loading ? hiddenContainerStyle : undefined}>
        {children}
      </div>
      {loading && (
        <div
          className="rmw-spinner-box"
          style={{ width: box.width, height: box.height }}
          aria-busy="true"
        >
          <Spinner size={size} color={color} />
        </div>
      )}
    </div>
  );
}
