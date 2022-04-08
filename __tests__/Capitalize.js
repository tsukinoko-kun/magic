require("../DataStructures");

test("capitalize", () => {
  expect("ahoi kollege".capitalize()).toBe("Ahoi Kollege");
  expect("test test  test   123\nabc".capitalize()).toBe(
    "Test Test  Test   123\nAbc"
  );
});
