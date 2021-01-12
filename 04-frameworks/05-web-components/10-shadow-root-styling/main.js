const searchbar = document.getElementById('searchbar');
searchbar.addEventListener('myEvent', (event) => {console.log('evento escuchado!!', event);});

let SearchbarShadowRoot = searchbar.shadowRoot;
console.log(SearchbarShadowRoot); // Será null si el shadowRoot se declaró 'closed'