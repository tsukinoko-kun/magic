declare global {
  interface Map<K, V> {
    /**
     *
     * @param key
     * @param factory
     */
    getOrCreate(key: K, factory: () => V): V;
    getOrCreate(key: K, value: { valueOf: () => V }): V;
    getOrCreateAsync(key: K, factory: () => Promise<V>): Promise<V>;
    getOrCreateAsync(key: K, value: Promise<V>): Promise<V>;
  }
}

if (!Map.prototype.hasOwnProperty("getOrCreate")) {
  Map.prototype.getOrCreate = function <K, V>(
    key: K,
    factory: (() => V) | { valueOf: () => V }
  ): V {
    if (this.has(key)) {
      return this.get(key);
    } else {
      if (typeof factory === "function") {
        const value = factory();
        this.set(key, value);
        return value;
      } else {
        const value = factory.valueOf();
        this.set(key, value);
        return value;
      }
    }
  };
}

if (!Map.prototype.hasOwnProperty("getOrCreateAsync")) {
  Map.prototype.getOrCreateAsync = async function <K, V>(
    key: K,
    factory: (() => Promise<V>) | Promise<V>
  ): Promise<V> {
    if (this.has(key)) {
      return this.get(key);
    } else {
      if (typeof factory === "function") {
        const value = await factory();
        this.set(key, value);
        return value;
      } else {
        const value = await factory;
        this.set(key, value);
        return value;
      }
    }
  };
}

export {};
