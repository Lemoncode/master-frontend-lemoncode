class SearchBar extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    // Return value from super() is a reference to this element
    self = super();

    const container = document.createElement('div');
    container.setAttribute('class', 'container');
    
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'field');

    let placeholder;
    if(this.hasAttribute('ph')) {
      placeholder = this.getAttribute('ph');
    } else {
      placeholder = "Search...";
    }
    input.setAttribute('placeholder', placeholder);
    input.setAttribute('part', 'input');
    
    const iconContainer = document.createElement('div');
    iconContainer.setAttribute('class', 'icons-container');
    
    const iconSearch = document.createElement('div');
    iconSearch.setAttribute('class', 'icon-search');

    const style = document.createElement('style');
    style.textContent = `
      .container {
        position: relative;
        padding: 0;
        margin: 0;
        border: 0;
        width: 150px;
        height: 30px;
      }
      
      .field {
        width: 100%;
        height: 100%;
        border-radius: 3px;
      }
      
      .icons-container {
        position: absolute;
        top: 5px;
        right: -10px;
        width: 30px;
        height: 30px;
      }
      
      .icon-search {
        position: relative;
        width: 50%;
        height: 50%;
        opacity: 1;
        border-radius: 50%;
        border: 3px solid #c7d0f8;
      }
      
      .icon-search:after {
        content: "";
        position: absolute;
        bottom: -9px;
        right: -2px;
        width: 4px;
        border-radius: 3px;
        transform: rotate(-45deg);
        height: 10px;
        background-color: #c7d0f8;
      }

      :host { /* afecta a todas las etiquetas search-bar */
        background-color: #aaa;
      }

      :host(#searchbar2) { /* afecta a todas la etiquetas search-bar que cumplan el selector indicado entre paréntesis */
        background-color: #bbb;
      }

      :host input { /* afecta a los inputs de dentro. Hubiera sido lo mismo poner solamente input sin :host */
        background-color: #ccc;
      }

      :host(.ddd) input { /* afecta a los inputs de dentro si el host cumple el selector indicado */
        background-color: #ddd;
      }

      :host-context(.dark-theme) input { /* afecta a los input de dentro si fuera existe algo con .dark-theme */
        color: #fff;
        background-color: #000;
      }
    `;

    const shadow = this.attachShadow({mode: 'open'});
    iconContainer.appendChild(iconSearch);
    container.appendChild(input);
    container.appendChild(iconContainer);
    shadow.appendChild(container);
    shadow.appendChild(style);

    const myEvent = new CustomEvent("myEvent", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {name: 'Carlos', text: 'hola'}
    });

    setTimeout( () => { this.dispatchEvent(myEvent); }, 5000);
  }
}

// Define the new element
customElements.define('search-bar', SearchBar);