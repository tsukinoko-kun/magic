export function requireScript(src, module = false) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
        }
        else {
            const el = document.createElement("script");
            el.src = src;
            el.defer = true;
            if (module) {
                el.type = "module";
            }
            el.addEventListener("load", () => {
                resolve();
            });
            el.addEventListener("error", (ev) => {
                reject(ev);
            });
            document.body.appendChild(el);
        }
    });
}
export function requireLink(rel, href, type) {
    return new Promise((resolve, reject) => {
        const tEl = document.querySelector(`script[href="${href}"]`);
        if (tEl && tEl.getAttribute("rel") == rel) {
            resolve();
        }
        else {
            const el = document.createElement("link");
            el.rel = rel;
            el.href = href;
            if (type) {
                el.type = type;
            }
            el.addEventListener("load", () => {
                resolve();
            });
            el.addEventListener("error", (ev) => {
                reject(ev);
            });
            document.body.appendChild(el);
        }
    });
}
