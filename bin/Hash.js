var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Simple 32 bit hash.
 * @param allowNegative true to use signed 32 bit integer, false to use unsigned 32 bit integer.
 * If you can, use the async hash, it produces less collision.
 */
export function simpleHash(value, allowNegative = false) {
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
    }
    else {
        return hash + 0x80000000;
    }
}
export class Hash {
    constructor(value) {
        this.buffer = value;
    }
    static new(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Hash(new Uint32Array(yield crypto.subtle.digest("SHA-1", new TextEncoder().encode(value))));
        });
    }
    toString() {
        return String.fromCharCode(...this.buffer);
    }
    compare(other) {
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
export function hashAsync(value) {
    return __awaiter(this, void 0, void 0, function* () {
        return Hash.new(value);
    });
}
