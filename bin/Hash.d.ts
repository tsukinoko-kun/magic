/**
 * Simple 32 bit hash.
 * @param allowNegative true to use signed 32 bit integer, false to use unsigned 32 bit integer.
 * If you can, use the async hash, it produces less collision.
 */
export declare function simpleHash(value: string | {
    toString: () => string;
}, allowNegative?: boolean): number;
export declare class Hash {
    private readonly buffer;
    constructor(value: Uint32Array);
    static new(value: any): Promise<Hash>;
    toString(): string;
    compare(other: Hash): boolean;
    [Symbol.iterator](): Generator<number, void, unknown>;
    [Symbol.toStringTag](): string;
}
/**
 * SHA-1 160 bit hash.
 */
export declare function hashAsync(value: any): Promise<Hash>;
//# sourceMappingURL=Hash.d.ts.map