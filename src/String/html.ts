import { StringBuilder } from "../DataStructures";

export function html(
  html: TemplateStringsArray,
  ...parameters: Array<string | number | Element>
): HTMLCollection {
  const htmlSB = new StringBuilder();
  for (const snippet of html) {
    htmlSB.append(snippet);
    const parameter = parameters.shift();
    switch (typeof parameter) {
      case "string":
        htmlSB.append(parameter);
        break;
      case "number":
        htmlSB.append(parameter.toString());
        break;
      case "object":
        htmlSB.append(parameter.outerHTML);
        break;
    }
  }

  const buffer = document.createElement("span");
  buffer.innerHTML = htmlSB.toString();
  return buffer.children;
}
