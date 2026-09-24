import { isValidElement, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { measure } from './measure';
import { getCachedShape, setCachedShape } from './cache';
import './shimmer.css';
import { ShapeRenderer } from './ShapeRenderer';

export interface SkeletonLoaderProps {
  loading: boolean;
  children: ReactNode;
  /**
   * Overrides the auto-derived cache key. Auto-derivation uses the
   * children's component type, which is ambiguous for multiple instances
   * of the same component (e.g. list items) — pass an explicit key
   * (e.g. including an id) to keep each instance's measured shape separate.
   */
  cacheKey?: string;
}

const hiddenContainerStyle: CSSProperties = {
  visibility: 'hidden',
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none',
};

function deriveCacheKey(children: ReactNode): string {
  if (isValidElement(children)) {
    const type = children.type;
    if (typeof type === 'string') return type;
    const named = type as { displayName?: string; name?: string };
    return named.displayName ?? named.name ?? 'anonymous';
  }
  return 'fragment';
}

function FallbackSkeleton() {
  return (
    <div className="rmw-fallback" aria-busy="true" aria-live="polite">
      <div className="rmw-shape rmw-shape--text" style={{ width: '80%', height: 16 }} />
      <div className="rmw-shape rmw-shape--text" style={{ width: '60%', height: 16 }} />
      <div className="rmw-shape rmw-shape--text" style={{ width: '70%', height: 16 }} />
    </div>
  );
}

/**
 * Children stay mounted for the lifetime of this component regardless of
 * `loading` — only visibility toggles. This is deliberate: mounting the
 * real children to measure them, then unmounting/remounting on every
 * loading transition, would double-fire their effects (e.g. data fetches)
 * on each cycle. See the cache.ts gotcha in CLAUDE.md.
 */
export function SkeletonLoader({ loading, children, cacheKey }: SkeletonLoaderProps) {
  const key = cacheKey ?? deriveCacheKey(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cached, setCached] = useState(() => getCachedShape(key));

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    const shapes = measure(container);
    const measurement = { shapes, width: rect.width, height: rect.height };

    setCachedShape(key, measurement);
    setCached(measurement);
  }, [key, children]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={containerRef} style={loading ? hiddenContainerStyle : undefined}>
        {children}
      </div>
      {loading &&
        (cached ? (
          <ShapeRenderer
            shapes={cached.shapes}
            containerWidth={cached.width}
            containerHeight={cached.height}
          />
        ) : (
          <FallbackSkeleton />
        ))}
    </div>
  );
}
