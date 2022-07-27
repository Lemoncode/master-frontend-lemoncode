class SearchBar extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    // Return value from super() is a reference to this element
    self = super();

    const container = document.createElement('div');
    container.setAttribute('class', 'container');
    
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Search...');
    input.setAttribute('class', 'field');
    
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

    iconContainer.appendChild(iconSearch);
    container.appendChild(input);
    container.appendChild(iconContainer);
    this.appendChild(container);
    this.appendChild(style);
  }
}

// Define the new element
customElements.define('search-bar', SearchBar);

