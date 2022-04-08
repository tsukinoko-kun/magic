interface Map<K, V> {
  getOrCreate(key: K, factory: () => V): V;
  getOrCreate(key: K, value: { valueOf: () => V }): V;
}

Map.prototype.getOrCreate = function <K, V>(
  key: K,
  factory: (() => V) | { valueOf: () => V }
): V {
  let value = this.get(key);
  if (value === undefined) {
    if (typeof factory === "function") {
      value = factory();
    } else {
      value = factory.valueOf();
    }
    this.set(key, value);
  }
  return value;
};
