const StringBuilder = require("../").StringBuilder;

//#region Preset

const randomStrings = new Array();

const charSet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const l = charSet.length;
for (let i = 0; i <= 2; i++) {
  let s = "";
  const charCount = Math.random() * 10;

  for (let i = 0; i < charCount; i++) {
    s += charSet.charAt(Math.floor(Math.random() * l));
  }

  randomStrings.push(s);
}

//#endregion

test("StringBuilder.append", () => {
  const sb = new StringBuilder(randomStrings[0]);
  expect(sb.toString()).toBe(randomStrings[0]);

  sb.append(randomStrings[1]);
  expect(sb.toString()).toBe(randomStrings[0] + randomStrings[1]);

  sb.append(randomStrings[2]);
  expect(sb.toString()).toBe(
    randomStrings[0] + randomStrings[1] + randomStrings[2]
  );
});

test("StringBuilder.appendLine", () => {
  const sb = new StringBuilder();
  sb.appendLine(randomStrings[0]);
  expect(sb.toString()).toBe(`${randomStrings[0]}\n`);

  sb.appendLine(randomStrings[1]);
  expect(sb.toString()).toBe(`${randomStrings[0]}\n${randomStrings[1]}\n`);

  sb.appendLine(randomStrings[2]);
  expect(sb.toString()).toBe(
    `${randomStrings[0]}\n${randomStrings[1]}\n${randomStrings[2]}\n`
  );
});

test("StringBuilder.replace", () => {
  const sb = new StringBuilder();
  sb.append("a");
  sb.appendLine("b");
  sb.append("c");
  sb.append("d");
  sb.append("e");
  sb.append("c");
  sb.append("f");
  sb.append("g");
  sb.append("c");
  sb.append("h");

  expect(sb.toString()).toBe("ab\ncdecfgch");
  sb.replace("c", "C");
  expect(sb.toString()).toBe("ab\nCdecfgch");
  sb.replaceAll("c", "C");
  expect(sb.toString()).toBe("ab\nCdeCfgCh");
});
