const searchbar = document.getElementById('searchbar');
searchbar.addEventListener('myEvent', (event) => {console.log('evento escuchado!!', event);});

setTimeout( () => { 
  console.log('timeout para cambiar el atributo');
  searchbar.setAttribute('ph', 'Atributo cambiado'); 
} , 3000);