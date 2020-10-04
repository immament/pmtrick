export function injectFileScript(file: string, node?: Element): void {
    const script = document.createElement('script');
    script.src = browser.extension.getURL(file);
    (node || document.head).appendChild(script);
    script.onload = function () {
        script.remove();
    };
}

export function injectScript(scriptContent: string): void {
    const script = document.createElement('script');
    const inlineScript = document.createTextNode(scriptContent);
    script.appendChild(inlineScript);
    document.head.appendChild(script);
    script.onload = function () {
        script.remove();
    };
}
