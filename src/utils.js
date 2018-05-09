const rootEl = document.getElementById("root");

export function printRules(styleSheet) {
    const preEl = rootEl.appendChild(
        document.createElement("pre")
    );
    preEl.innerHTML = JSON.stringify(
        [...styleSheet.cssRules].map(
            rule => rule.cssText
        ),
        null,
        2
    );
}