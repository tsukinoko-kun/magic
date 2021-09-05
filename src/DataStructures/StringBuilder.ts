/**
 * Represents a mutable string of characters
 */
export class StringBuilder {
  private buffer: Array<string>;
  public length: number;
  private static lineTerminator = "\n";

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

  /**
   * Converts the value of a StringBuilder to a string.
   */
  public toString() {
    return this.buffer.join("");
  }

  /**
   * Appends a string to this instance.
   */
  public append(value: string) {
    this.buffer.push(value);
    this.length += value.length;
  }

  /**
   * Appends the default line terminator, or a copy of a specified string and the default line terminator, to the end of this instance.
   */
  public appendLine(value: string) {
    this.buffer.push(value + StringBuilder.lineTerminator);
    this.length += value.length + 1;
  }

  /**
   * Removes all characters from the StringBuilder instance.
   */
  public clear() {
    this.length = 0;
    this.buffer = new Array<string>();
  }

  /**
   * Replaces text in a StringBuilder, using an object that supports replacement within a string.
   * @param searchValue A object can search for and replace matches within a string.
   * @param replacer A function that returns the replacement text.
   */
  public replace(searchValue: string | RegExp, replaceValue: string): void {
    this.buffer = [this.toString().replace(searchValue, replaceValue)];
    if (
      typeof searchValue === "object" ||
      searchValue.length !== replaceValue.length
    ) {
      this.countLength();
    }
  }

  /**
   * Replace all instances of a substring in a StringBuilder, using a regular expression or search string.
   * @param searchValue A string to search for.
   * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
   */
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
