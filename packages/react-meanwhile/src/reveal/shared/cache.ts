export interface ShapeCache<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  has(key: string): boolean;
  clear(): void;
}

export function createShapeCache<T>(): ShapeCache<T> {
  const store = new Map<string, T>();

  return {
    get: (key) => store.get(key),
    set: (key, value) => {
      store.set(key, value);
    },
    has: (key) => store.has(key),
    clear: () => store.clear(),
  };
}
