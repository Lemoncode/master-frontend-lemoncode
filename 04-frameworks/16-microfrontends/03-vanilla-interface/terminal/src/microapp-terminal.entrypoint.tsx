import { createRoot, Root } from "react-dom/client";

import { Terminal, TerminalProps } from "./pods/terminal.component";

/**
 * Microapp public interface to be consumed by the host app.
 * Made with vanilla JS to avoid dependencies.
 * Basic interface to render, update and unmount the microapp, while keeping
 * technology agnostic.
 */
export interface MicroappInterface {
  render: (container: HTMLElement, props?: TerminalProps) => void;
  update: (props?: TerminalProps) => void;
  unmount: (container?: HTMLElement) => void;
  root?: Root;
}

// eslint-disable-next-line react-refresh/only-export-components
export const MicroappTerminal: MicroappInterface = {
  render(container, props) {
    if (!container) return;
    // Microapp root node will be a child of the host container.
    // This is needed to establish a clear separation between the host and the
    // microapp component trees. Now different technologies could be used
    // without interference.
    const rootNode = document.createElement("div");
    container.appendChild(rootNode);
    this.root = createRoot(rootNode);
    this.update(props);
  },
  update(props) {
    this.root?.render(<Terminal {...props} />);
  },
  unmount() {
    this.root?.unmount(); // See NOTE below.
  },
};
export default MicroappTerminal;

/**
 * Be aware that unmounting within a React.Strict block, a false positive
 * will popup. Explained here: https://github.com/facebook/react/issues/25675
 * This is a hack to avoid the false positive only for development:
 * if (import.meta.env.DEV) {
 *    const rootForLaterUnmount = this.root;
 *    delete this.root;
 *    setTimeout(() => rootForLaterUnmount.unmount(), 0);
 *  }
 */
