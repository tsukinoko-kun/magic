const pathSplit = (path: string, keepEmpty: boolean = false): Array<string> => {
  const arr = new Array<string>();

  let current = "";
  for (const char of path) {
    if (char === "/" || char === "\\") {
      if (current !== "" || keepEmpty) {
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
  const absoluteDirectory = isAbsolute(path);
  const arr = pathSplit(path);
  const pathArr = new Array<string>();

  for (const item of arr) {
    switch (item) {
      case ".":
        break;
      case "..":
        if (pathArr.length !== 0) {
          if (pathArr[pathArr.length - 1] === "..") {
            pathArr.push("..");
          } else if (pathArr[pathArr.length - 1] === ".") {
            pathArr[pathArr.length - 1] = "..";
          } else {
            pathArr.pop();
          }
        } else {
          pathArr.push("..");
        }
        break;
      default:
        pathArr.push(item);
        break;
    }
  }

  if (absoluteDirectory) {
    while (
      (pathArr.length !== 0 && pathArr[0] === "..") ||
      pathArr[0] === "."
    ) {
      pathArr.shift();
    }
  }

  if (pathArr.length === 0 && absoluteDirectory) {
    return "/";
  }

  let pathStr = pathArr.join("/") || ".";

  if (explicitDirectory) {
    pathStr += "/";
  }

  if (absoluteDirectory && pathStr[0] !== "/") {
    pathStr = "/" + pathStr;
  }

  return pathStr;
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

const resolve = (...pathSegments: Array<string>): string => {
  let absolute = false;
  for (let i = pathSegments.length - 1; i >= 0; i--) {
    if (isAbsolute(pathSegments[i]!)) {
      absolute = true;
      pathSegments = pathSegments.slice(i);
      break;
    }
  }

  const pathArr = pathSplit(
    absolute
      ? join(...pathSegments)
      : join(document.location.pathname, join(...pathSegments))
  );

  while ((pathArr.length !== 0 && pathArr[0] === "..") || pathArr[0] === ".") {
    pathArr.shift();
  }

  return "/" + pathArr.join("/");
};

const isAbsolute = (path: string): boolean => path[0] === "/";

const relative = (from: string, to: string): string => {
  return join(from, to);
};

const dirname = (path: string): string => {
  const arr = pathSplit(path, true);

  while (arr[arr.length - 1] === "") {
    arr.pop()!;
  }

  if (arr.length !== 0) {
    arr.pop();
  }

  const pathStr = arr.join("/");
  if (isAbsolute(path)) {
    if (pathStr[0] === "/") {
      return pathStr;
    } else {
      return "/" + pathStr;
    }
  } else {
    return arr.join("/") || ".";
  }
};

const basename = (path: string, ext?: string): string => {
  let fullSlash = true;
  for (const char of path) {
    if (char !== "/") {
      fullSlash = false;
      break;
    }
  }

  // Weird node behavior
  if (fullSlash) {
    if (!ext || ext == path) {
      return "";
    } else {
      return path;
    }
  }

  const fileName = pathSplit(path).pop() ?? "";
  if (ext && fileName.endsWith(ext) && fileName.length > ext.length) {
    return fileName.substring(0, fileName.length - ext.length);
  }
  return fileName;
};

const extname = (path: string): string => {
  const fileName = pathSplit(path).pop() ?? "";
  const index = fileName.lastIndexOf(".");

  if (index === -1 || index === 0 || index === fileName.length - 1) {
    return "";
  }
  return fileName.substring(index);
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
   * The right-most parameter is considered {to}.  Other parameters are considered an array of {from}.
   *
   * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
   *
   * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
   * until an absolute path is found. If after using all {from} paths still no absolute path is found,
   * the current working directory is used as well. The resulting path is normalized,
   * and trailing slashes are removed unless the path gets resolved to the root directory.
   *
   * @param pathSegments string paths to join.
   */
  resolve,

  /**
   * Determines whether {path} is an absolute path. An absolute path will always resolve to the same location, regardless of the working directory.
   *
   * @param path path to test.
   */
  isAbsolute,

  /**
   * Solve the relative path from {from} to {to}.
   * At times we have two absolute paths, and we need to derive the relative path from one to the other. This is actually the reverse transform of path.resolve.
   */
  relative,

  /**
   * Return the directory name of a path. Similar to the Unix dirname command.
   *
   * @param path the path to evaluate.
   */
  dirname,

  /**
   * Return the last portion of a path. Similar to the Unix basename command.
   * Often used to extract the file name from a fully qualified path.
   *
   * @param path the path to evaluate.
   * @param ext optionally, an extension to remove from the result.
   */
  basename,

  /**
   * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
   * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string
   *
   * @param path the path to evaluate.
   */
  extname,
};
