const whitespace = /\s$/;

/**
 * Makes all initial letters uppercase
 *
 * "abc def" -> "Abc Def"
 */
export const capitalize = (str: string) =>
  str
    .split("")
    .reduce((prev, cur, i) =>
      i === 1
        ? prev.toLocaleUpperCase() + cur
        : prev + (whitespace.test(prev) ? cur.toLocaleUpperCase() : cur)
    );
