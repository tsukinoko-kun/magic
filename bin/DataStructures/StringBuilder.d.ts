/**
 * Represents a mutable string of characters
 */
export declare class StringBuilder {
    private buffer;
    length: number;
    constructor(value?: string | undefined);
    [Symbol.iterator](): Generator<string, void, unknown>;
    toString(): string;
    append(value: string): void;
    appendLine(value: string): void;
    clear(): void;
    replace(searchValue: string | RegExp, replaceValue: string): void;
    replaceAll(searchValue: string | RegExp, replaceValue: string): void;
    private countLength;
}
//# sourceMappingURL=StringBuilder.d.ts.map