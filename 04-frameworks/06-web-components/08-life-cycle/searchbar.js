class SearchBar extends HTMLDivElement {

  getInput() {
    console.log("get input");
    return this.state.myinput;
  }

  setInput(value) {
    // You can add some logic here to control the value
    console.log("set input");
    this.state.myinput=value;
  }

  constructor() {
    // Always call super first in constructor
    // Return value from super() is a reference to this element
    self = super();

    this.state = {
      myinput: null
    };

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
    `;

    const shadow = this.attachShadow({mode: 'closed'});
    iconContainer.appendChild(iconSearch);
    container.appendChild(input);
    container.appendChild(iconContainer);
    shadow.appendChild(container);
    shadow.appendChild(style);

    this.setInput(input);

    const myEvent = new CustomEvent("myEvent", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {name: 'Carlos', text: 'hola'}
    });

    setTimeout( () => { this.dispatchEvent(myEvent); }, 5000);

  }

  connectedCallback() {
    console.log('Elemento Searchbar se ha añadido a la página.');
  }

  disconnectedCallback() {
    console.log('Elemento Searchbar se ha quitado del DOM.');
  }

  adoptedCallback() {
    console.log('Elemento Searchbar se ha movido a otra página.');
    // https://stackoverflow.com/questions/50995139/when-does-webcomponent-adoptedcallback-fire
  }

  static get observedAttributes() { return ['ph', 'id']; }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Algún atributo de Searchbar ha cambiado.', name, oldValue, newValue);
    
    if(name === 'ph') {
      this.getInput().setAttribute('placeholder', newValue);
    }
  }
}

// Define the new element
customElements.define('search-bar', SearchBar, { extends: 'div' });