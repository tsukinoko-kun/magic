declare global {
  interface String {
    /**
     * Makes all initial letters uppercase
     *
     * "abc def" -> "Abc Def"
     */
    capitalize(): string;
  }
}

const whitespace = /\s$/;

if (!String.prototype.hasOwnProperty("capitalize")) {
  String.prototype.capitalize = function (): string {
    return this.split("").reduce((prev, cur, i) =>
      i === 1
        ? prev.toLocaleUpperCase() + cur
        : prev + (whitespace.test(prev) ? cur.toLocaleUpperCase() : cur)
    );
  };
}

export {};
