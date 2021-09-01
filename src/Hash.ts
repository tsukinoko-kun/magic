/**
 * Simple 32 bit hash.
 * @param allowNegative true to use signed 32 bit integer, false to use unsigned 32 bit integer.
 * If you can, use the async hash, it produces less collision.
 */
export function simpleHash(
  value: string | { toString: () => string },
  allowNegative = false
) {
  const str = typeof value === "string" ? value : value.toString();
  var hash = 0;
  if (str.length === 0) {
    return hash;
  }

  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  if (allowNegative) {
    return hash;
  } else {
    return hash + 0x80000000;
  }
}

export class Hash {
  private readonly buffer: Uint32Array;

  constructor(value: Uint32Array) {
    this.buffer = value;
  }

  static async new(value: any) {
    return new Hash(
      new Uint32Array(
        await crypto.subtle.digest("SHA-1", new TextEncoder().encode(value))
      )
    );
  }

  toString() {
    return String.fromCharCode(...this.buffer);
  }

  compare(other: Hash) {
    const iter1 = this[Symbol.iterator]();
    const iter2 = other[Symbol.iterator]();

    let a = iter1.next();
    let b = iter2.next();

    do {
      if (a.value !== b.value) {
        return false;
      }
      [a, b] = [iter1.next(), iter2.next()];
    } while (!a.done);

    return true;
  }

  *[Symbol.iterator]() {
    for (const el of this.buffer) {
      yield el;
    }
  }

  [Symbol.toStringTag]() {
    return this.toString();
  }
}

/**
 * SHA-1 160 bit hash.
 */
export async function hashAsync(value: any) {
  return Hash.new(value);
}
