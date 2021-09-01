/**
 * Represents a mutable string of characters
 */
export class StringBuilder {
  private buffer: Array<string>;
  public length: number;

  constructor(value: string | undefined = undefined) {
    this.buffer = new Array<string>();
    if (value) {
      this.buffer.push(value);
      this.length = value.length;
    } else {
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

  public toString() {
    return this.buffer.join("");
  }

  public append(value: string) {
    this.buffer.push(value);
    this.length += value.length;
  }

  public appendLine(value: string) {
    this.buffer.push(value + "\n");
    this.length += value.length + 1;
  }

  public clear() {
    this.length = 0;
    this.buffer = new Array<string>();
  }

  public replace(searchValue: string | RegExp, replaceValue: string): void {
    this.buffer = [this.toString().replace(searchValue, replaceValue)];
    this.countLength();
  }

  public replaceAll(searchValue: string | RegExp, replaceValue: string): void {
    if (typeof searchValue === "string") {
      const r = new RegExp(searchValue, "g");
      this.buffer = [this.toString().replace(r, replaceValue)];
    } else if (searchValue instanceof RegExp) {
      this.buffer = [this.toString().replace(searchValue, replaceValue)];
    }
    this.countLength();
  }

  private countLength() {
    this.length =
      this.buffer.length >= 0
        ? this.buffer.map((snippet) => snippet.length).reduce((a, b) => a + b)
        : 0;
  }
}
