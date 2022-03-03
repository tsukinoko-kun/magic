const pathSplit = (path: string): Array<string> => {
  const arr = new Array<string>();

  let current = "";
  for (const char of path) {
    if (char === "/" || char === "\\") {
      if (current !== "") {
        arr.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }

  if (current.length !== 0) {
    arr.push(current);
  }

  return arr;
};

const normalize = (path: string): string => {
  const explicitDirectory = path.endsWith("/");
  const arr = pathSplit(path);
  const normalized = new Array<string>();

  for (const item of arr) {
    switch (item) {
      case ".":
        break;
      case "..":
        if (normalized.length !== 0) {
          if (normalized[normalized.length - 1] === "..") {
            normalized.push("..");
          } else if (normalized[normalized.length - 1] === ".") {
            normalized[normalized.length - 1] = "..";
          } else {
            normalized.pop();
          }
        } else {
          normalized.push("..");
        }
        break;
      default:
        normalized.push(item);
        break;
    }
  }

  if (explicitDirectory) {
    return normalized.join("/") + "/";
  } else {
    return normalized.join("/");
  }
};

const join = (...paths: Array<string>): string => {
  switch (paths.length) {
    case 0:
      return ".";
    case 1:
      return normalize(paths[0]!);
    default:
      return normalize(paths.join("/"));
  }
};

export const path = {
  join,
  normalize,
};
