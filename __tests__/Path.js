const nodePath = require("path");
const magicPath = require("../bin").path;

test("path.normalize", () => {
  expect(magicPath.normalize("./test/test.js")).toBe(
    nodePath.normalize("./test/test.js")
  );

  expect(magicPath.normalize("./test/")).toBe(nodePath.normalize("./test/"));

  expect(magicPath.normalize("./test")).toBe(nodePath.normalize("./test"));

  expect(magicPath.normalize(".././test/test.js")).toBe(
    nodePath.normalize(".././test/test.js")
  );

  expect(magicPath.normalize("test/.../test.js")).toBe(
    nodePath.normalize("test/.../test.js")
  );

  const specialCharacters = "!@#$%^&*()_+{}|:\"<>?[];',./";
  const testPath = new Array();
  for (let i = 0; i < 10; i++) {
    const testPathEl = new Array();
    for (let j = 0; j < 10; j++) {
      testPath.push(
        specialCharacters[Math.floor(Math.random() * specialCharacters.length)]
      );
    }
    testPath.push(testPathEl.join(""));
  }
  const testPathString = testPath.join("/");
  expect(magicPath.normalize(testPathString)).toBe(
    nodePath.normalize(testPathString)
  );
});

test("path.join", () => {
  const testPaths = new Array();
  for (let i = 0; i < 10; i++) {
    const testPath = new Array();
    for (let j = 0; j < 10; j++) {
      switch (Math.floor(Math.random() * 3)) {
        case 0:
          const randomStr = (Math.random() * 10000000000000000000).toString(36);
          testPath.push(randomStr);
          break;
        case 1:
          testPath.push(".");
          break;
        case 2:
          testPath.push("..");
          break;
      }
    }

    const testPathStr = testPath.join("/");
    testPaths.push(testPathStr);
  }

  expect(magicPath.join(...testPaths)).toBe(nodePath.join(...testPaths));
});
