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

const dirname = (path: string): string => {
  const arr = pathSplit(path);

  if (arr.length !== 0) {
    arr.pop();
  }

  return arr.join("/") || ".";
};

export const path = {
  /**
   * Normalize a string path, reducing '..' and '.' parts.
   * When multiple slashes are found, they're replaced by a single one; when the path contains a trailing slash, it is preserved.
   *
   * @param path string path to normalize.
   */
  normalize,

  /**
   * Join all arguments together and normalize the resulting path.
   * Arguments must be strings.
   *
   * @param paths paths to join.
   */
  join,

  /**
   * Return the directory name of a path. Similar to the Unix dirname command.
   *
   * @param path the path to evaluate.
   */
  dirname,
};
