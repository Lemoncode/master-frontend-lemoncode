import { type App, createApp, type VueElement } from "vue";

export const createCustomElement = (
  tagName: string,
  vueElement: VueElement
) => {
  class VueCustomElement extends HTMLElement {
    private app: App<Element> | null = null;

    connectedCallback() {
      if (!this.app) {
        this.attachShadow({ mode: "open" });
        this.app = createApp(vueElement);
        this.app.mount(this.shadowRoot as any);
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach((link) => {
          this.shadowRoot?.appendChild(link.cloneNode(true));
        });
      }
    }

    disconnectedCallback() {
      if (this.app) {
        this.app.unmount();
        this.app = null;
      }
    }
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, VueCustomElement);
  }
};
