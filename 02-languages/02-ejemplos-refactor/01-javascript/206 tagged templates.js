///-- TAGGED TEMPLATES ***************************************************************************

/*
Una forma avanzada de utilizar los template literals es mediante lo que se conoce como TAGGED
TEMPLATES. Este mecanismo nos permite consumir plantillas mediante una función y devolver resultados
customizados:
*/

// EJEMPLO 1

// *** Data
const dataA = {
  description: "iPhone 14 Pro",
  imagen: "/static/iphnone/14-pro.jpg",
  price: 1189.00,
};
const dataB = {
  description: "iPhone 13",
  imagen: "/static/iphnone/13.jpg",
  price: 859.00,
};

// *** Templating
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

// *** Usage
const articleA = articleTemplate(dataA)
const articleB = articleTemplate(dataB)

console.log(articleA);
console.log(articleB);
/*
<article>
  <h2>iPhone 14 Pro</h2>
  <img src="/static/iphnone/14-pro.jpg" />
  <span>1189 €</span>
</article>
*/


// EJEMPLO 2
// Alternativa al ejemplo anterior:

// *** Data
const acuario = ["Acuario", "fantástica", "el amor llama a tu puerta"];
const leo = ["Leo", "un mojón", "tu código es horrible"];

// *** Templating
// ⚠ OJO, aqui el argumento phrases no corresponde a las frases de cada línea sino a los chunks
// de texto entre placeholders.
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

// *** Usage
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