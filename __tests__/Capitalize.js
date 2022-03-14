const capitalize = require("../String/capitalize").capitalize;

test("capitalize", () => {
  expect(capitalize("ahoi kollege")).toBe("Ahoi Kollege");
  expect(capitalize("test test  test   123\nabc")).toBe(
    "Test Test  Test   123\nAbc"
  );
});
