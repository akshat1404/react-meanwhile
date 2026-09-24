import type { CachedMeasurement } from '../../types';

const shapeCache = new Map<string, CachedMeasurement>();

export function getCachedShape(key: string): CachedMeasurement | undefined {
  return shapeCache.get(key);
}

export function setCachedShape(key: string, measurement: CachedMeasurement): void {
  shapeCache.set(key, measurement);
}

export function hasCachedShape(key: string): boolean {
  return shapeCache.has(key);
}

export function clearShapeCache(): void {
  shapeCache.clear();
}
