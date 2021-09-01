/**
 * Represents a mutable string of characters
 */
export class StringBuilder {
    constructor(value = undefined) {
        this.buffer = new Array();
        if (value) {
            this.buffer.push(value);
            this.length = value.length;
        }
        else {
            this.length = 0;
        }
    }
    *[Symbol.iterator]() {
        for (const snippet of this.buffer) {
            for (const char of snippet) {
                yield char;
            }
        }
    }
    toString() {
        return this.buffer.join("");
    }
    append(value) {
        this.buffer.push(value);
        this.length += value.length;
    }
    appendLine(value) {
        this.buffer.push(value + "\n");
        this.length += value.length + 1;
    }
    clear() {
        this.length = 0;
        this.buffer = new Array();
    }
    replace(searchValue, replaceValue) {
        this.buffer = [this.toString().replace(searchValue, replaceValue)];
        this.countLength();
    }
    replaceAll(searchValue, replaceValue) {
        if (typeof searchValue === "string") {
            const r = new RegExp(searchValue, "g");
            this.buffer = [this.toString().replace(r, replaceValue)];
        }
        else if (searchValue instanceof RegExp) {
            this.buffer = [this.toString().replace(searchValue, replaceValue)];
        }
        this.countLength();
    }
    countLength() {
        this.length =
            this.buffer.length >= 0
                ? this.buffer.map((snippet) => snippet.length).reduce((a, b) => a + b)
                : 0;
    }
}
