///-- TEMPLATE LITERAL *******************************************************

// A partir de ES6 podemos usar los backticks para escribir strings:
const message = `Hello`;
console.log(message); // "Hello"

// Una ventaja que ofrecen es poder crear strings multilinea sin concatenación:
const riddle = `Sobre las oscuras sombras
del antiguo bastión,
el alto centinela cuadrado callado ve
correr la sangre en el noveno mes`;
console.log(riddle);
/*
"Sobre las oscuras sombras
del antiguo bastión,
el alto centinela cuadrado callado ve
correr la sangre en el noveno mes"
*/

// Otra de las cualidades de los string literals es que permiten interpolación de código:
const name = "Edward";
const message = `How are you, ${name}?`;
console.log(message); // "How are you, Edward?"

const formatMessage = (product, quantity) =>
  `You have ${quantity} ${product}${quantity === 1 ? '' : 's'} in the shopping cart`;

console.log(formatMessage("egg", 3)); // "You have 3 eggs in the shopping cart"
console.log(formatMessage("egg", 1)); // "You have 1 egg in the shopping cart"

// Una forma avanzada de utilizar los template literals es para modificar el resultado de la plantilla mediante una función:

const data = {
  description: "iPhone XS Max",
  imagen: "/static/iphnone/xs-max.jpg",
  price: 1259.00,
};
const createTemplate = (chunks, ...properties) => (data) => {
  const replaced = [...chunks];
  properties.forEach((prop, index) => {
    replaced[index] += data[prop];
  });
  return replaced.join('');
};
const articleTemplate = createTemplate`
<article>
  <h2>${"description"}</h2>
  <img src="${"imagen"}" />
  <span>${"price"} €</span>
</article>
`;
const articleA = articleTemplate(dataA)
const articleB = articleTemplate(dataB)

console.log(article);
/*
<article>
  <h2>iPhone XS Max</h2>
  <img src="/static/iphnone/xs-max.jpg" />
  <span>1259.00 €</span>
</article>
*/


// Alternativa al ejemplo anterior:
const acuario = ["Acuario", "fantástica", "el amor llama a tu puerta"];
const leo = ["Leo", "un mojón", "tu código es horrible"];

// [!] OJO, aqui el argumento phrases no corresponde a las frases de cada
// línea sino a los chunks de texto entre placeholders.
const templateFactory = (phrases, ...placeholders) => {
  return data => 
    phrases.map((phrase, index) => phrase + (data[placeholders[index]] || "")).join('');
};

const horoscopo = templateFactory`
- ${0} -
Hola querid@ ${0},
Esta semana va a ser ${1} para ti
debido a que ${2}.
- Tu Pitonisa de Confianza -
`;

console.log(horoscopo(acuario));
// - Acuario -
// Hola querid@ Acuario,
// Esta semana va a ser fantástica para ti
// debido a que el amor llama a tu puerta.
// - Tu Pitonisa de Confianza -
console.log(horoscopo(leo));
// - Leo -
// Hola querid@ Leo,
// Esta semana va a ser un mojón para ti
// debido a que tu código es horrible.
// - Tu Pitonisa de Confianza -