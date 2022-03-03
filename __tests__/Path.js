const nodePath = require("path").posix;
const magicPath = require("../bin").path;

globalThis.document = {
  location: {
    pathname: process.cwd(),
    origin: "file:///",
    protocol: "http:",
  },
};
globalThis.location = document.location;

const definedPaths = [
  "../",
  "",
  ".",
  "..",
  "./",
  "./..",
  "../..",
  "./../",
  "../../",
  "./test/",
  "./test",
  "./test/test.js",
  "/test/test.js",
  "/test/.js",
  ".././test/test.js",
  "test/.../test.js",
  "test/.../////test.js",
  "////..////.////",
  "/////",
  "////..////.////a/b/c///",
  "////..////.////a/b/c",
  ".////.////a/b/c",
  "a/b/c/d",
  "a/b/c/d/",
  "/a/b/c/d",
  "/a/b/c/d/",
  "../a/b/c/d/..",
];

/**
 *
 * @param {number} pathsCount number of paths to generate
 * @param {number} pathLength length of each path (number of segments)
 * @returns {Array<string>}
 */
const randomPaths = (pathsCount = 20, pathLength = 10) => {
  const testPaths = new Array();
  for (let i = 0; i < pathsCount; i++) {
    const testPath = new Array();
    for (let j = 0; j < pathLength; j++) {
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

  for (let i = 0; i < pathsCount; i++) {
    const specialCharacters = "!@#$%^&*()_+{}|:\"<>?[];',./";
    const specialCharPath = new Array();
    for (let i = 0; i < pathLength; i++) {
      const testPathEl = new Array();
      const cap = Math.floor(Math.random() * 10);
      for (let j = 0; j < cap; j++) {
        specialCharPath.push(
          specialCharacters[
            Math.floor(Math.random() * specialCharacters.length)
          ]
        );
      }
      specialCharPath.push(testPathEl.join(""));
    }
    testPaths.push(specialCharPath.join("/"));
  }

  return testPaths;
};

test("path.normalize", () => {
  for (const path of definedPaths) {
    expect(magicPath.normalize(path)).toBe(nodePath.normalize(path));
  }

  for (const path of randomPaths()) {
    expect(magicPath.normalize(path)).toBe(nodePath.normalize(path));
  }
});

test("path.join", () => {
  expect(magicPath.join(...definedPaths)).toBe(nodePath.join(...definedPaths));

  const rp = randomPaths();
  expect(magicPath.join(...rp)).toBe(nodePath.join(...rp));
});

test("path.dirname", () => {
  for (const path of definedPaths) {
    expect(magicPath.dirname(path)).toBe(nodePath.dirname(path));
  }

  for (const path of randomPaths()) {
    expect(magicPath.dirname(path)).toBe(nodePath.dirname(path));
  }
});

test("path.resolve", () => {
  for (const path of definedPaths) {
    expect(magicPath.resolve(path)).toBe(nodePath.resolve(path));
  }

  for (const path of randomPaths()) {
    expect(magicPath.resolve(path)).toBe(nodePath.resolve(path));
  }

  const rp = randomPaths();
  expect(magicPath.resolve(...rp)).toBe(nodePath.resolve(...rp));
});

test("path.isAbsolute", () => {
  for (const path of definedPaths) {
    expect(magicPath.isAbsolute(path)).toBe(nodePath.isAbsolute(path));
  }

  for (const path of randomPaths()) {
    expect(magicPath.isAbsolute(path)).toBe(nodePath.isAbsolute(path));
  }
});

test("path.basename", () => {
  for (const path of definedPaths) {
    expect(magicPath.basename(path)).toBe(nodePath.basename(path));
  }

  for (const path of definedPaths) {
    expect(magicPath.basename(path, ".js")).toBe(
      nodePath.basename(path, ".js")
    );
  }

  for (const path of randomPaths()) {
    expect(magicPath.basename(path)).toBe(nodePath.basename(path));
  }
});

test("path.extname", () => {
  for (const path of definedPaths) {
    expect(magicPath.extname(path)).toBe(nodePath.extname(path));
  }

  for (const path of randomPaths()) {
    expect(magicPath.extname(path)).toBe(nodePath.extname(path));
  }
});

test("path.format", () => {
  {
    const pathObj = {
      dir: "./a",
      base: "b.c",
    };
    expect(magicPath.format(pathObj)).toBe(nodePath.format(pathObj));
  }
  {
    const pathObj = { name: "a", ext: ".b" };
    expect(magicPath.format(pathObj)).toBe(nodePath.format(pathObj));
  }
  {
    const pathObj = {
      root: "/",
      name: "a",
      ext: ".b",
    };
    expect(magicPath.format(pathObj)).toBe(nodePath.format(pathObj));
  }
  {
    const pathObj = {
      dir: randomPaths(1)[0],
      name: "abc",
      ext: ".js",
    };
    expect(magicPath.format(pathObj)).toBe(nodePath.format(pathObj));
  }
  {
    const pathObj = {
      dir: randomPaths(1)[0],
    };
    expect(magicPath.format(pathObj)).toBe(nodePath.format(pathObj));
  }
});
