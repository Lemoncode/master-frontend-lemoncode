class SearchBar extends HTMLElement {
  constructor() {
    super();

    const template = document.getElementById('searchbar-template');
    const templateContent = template.content;

    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    container.appendChild(templateContent.cloneNode(true));
    this.attachShadow({mode: 'open'}).appendChild(container);
  }
}

// Define the new element
customElements.define('search-bar', SearchBar);