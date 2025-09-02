import { createRoot } from "react-dom/client";
import type { Options as BaseOptions } from "../lib/types";
import Root from "../lib/Root";
import { CopilotWidget } from "../lib/CopilotWidget";
import { composeRoot } from "./utils";

const defaultRootId = "copilot-root";
interface Options extends Omit<BaseOptions, "components"> {
  rootId?: string;
}
declare global {
  interface Window {
    initCoPilot: typeof initCoPilot;
  }
}

/**
 * @param rootId The id of the root element for more control, you don't need to use this unless you want more control over the widget
 * @description Initialize the widget
 */
function initCoPilot({
  containerProps,
  rootId,
  ...options
}: Options) {
  const container = composeRoot(rootId ?? defaultRootId, rootId === undefined);
  container.style.position = 'fixed';
  container.style.zIndex = '9999';
  console.log('widget init')
  createRoot(container).render(
    <Root
      options={{
        ...options,
      }}
      
      containerProps={containerProps}
    >
      <CopilotWidget />
    </Root>
  ); 
}

window.initCoPilot = initCoPilot;
