import type { CSSProperties } from "react";

function getOrCreateRootById(id: string): HTMLElement {
  let root = document.getElementById(id);

  if (!root) {
    root = document.createElement("div");
    root.id = id;
    document.body.appendChild(root);
  }
  return root;
}

function styleTheRoot(root: HTMLElement, styles?: CSSProperties): HTMLElement {
  Object.assign(root.style, styles);

  return root;
}

export function composeRoot(id: string, fluid?: boolean): HTMLElement {
  const baseStyles: CSSProperties = {
    isolation: "isolate",
    unicodeBidi: "bidi-override",
    fontVariantNumeric: "tabular-nums",
    zIndex: "999",
    position: "fixed",
  };

  const styles = fluid ? { ...baseStyles } : baseStyles;

  return styleTheRoot(getOrCreateRootById(id), styles);
}
