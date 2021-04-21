// RECURSIVIDAD **********************************************************

// Concepto:
/*
function recursive() {
  if(casoBaseOFinDelProblema) {
    return resultado;
  }

  return recursive(siguientePequeñoProblema);
}
*/

// Implementando funciones iteradoras usando recursividad:

// Función sumatoria
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Imperativa
const imperativeSum = (collection) => {
  let result = 0;
  for (let element of collection) {
    result += element;
  }
  return result;
};

console.log(imperativeSum(numbers));

// Declarativa
const declarativeSum = (collection) => collection.reduce((acc, val) => acc + val);

console.log(declarativeSum(numbers));

// Recursiva
const recursiveSum1 = (arr) => {
  if (!arr.length) return 0;
  const [head, ...tail] = arr;
  return head + recursiveSum3(tail);
};

const recursiveSum2 = (() => {
  const innerRecursiveSum = (collection, index) => {
    if (index < 0) return 0;
    return collection[index] + innerRecursiveSum(collection, index - 1)
  };

  return (collection) => innerRecursiveSum(collection, collection.length - 1);
})();

const recursiveSum3 = (() => {
  const innerRecursiveSum = (collection, index) => {
    if (index >= collection.length) return 0;
    return collection[index] + innerRecursiveSum(collection, index + 1)
  };

  return (collection) => innerRecursiveSum(collection, 0);
})();

console.log(recursiveSum1(numbers));
console.log(recursiveSum2(numbers));
console.log(recursiveSum3(numbers));


// Map imperativo
const imperativeMap = (collection, transform) => {
  const result = [];
  for (let element of collection) {
    result.push(transform(element));
  }
  return result;
};

// Map recursivo
const recursiveMap = (() => {
  const innerRecursiveMap = (collection, transform, index, newCollection) => {
    if (index >= collection.length) return newCollection;
    newCollection.push(transform(collection[index]));
    return innerRecursiveMap(collection, transform, index + 1, newCollection);
  };

  return (collection, transform) => innerRecursiveMap(collection, transform, 0, []);
})();

const tripleIt = (num) => num * 3;

console.log(imperativeMap(numbers, tripleIt));
console.log(recursiveMap(numbers, tripleIt));

// Filter imperativo
const imperativeFilter = (collection, predicate) => {
  const result = [];
  for (let element of collection) {
    if (predicate(element)) {
      result.push(element);
    }
  }
  return result;
}

const recursiveFilter = (() => {
  const innerRecursiveFilter = (collection, predicate, index, newCollection) => {
    if (index >= collection.length) return newCollection;
    const element = collection[index];
    if (predicate(element)) newCollection.push(element);
    return innerRecursiveFilter(collection, predicate, index + 1, newCollection);
  };

  return (collection, predicate) => innerRecursiveFilter(collection, predicate, 0, []);
})();

const isEven = (num) => num % 2 === 0;

console.log(imperativeFilter(numbers, isEven));
console.log(recursiveFilter(numbers, isEven));


// factorial imperativo
const imperativeFactorial = (num) => {
  let result = 1;
  for (let i = 1; i <= num; i++) {
    result *= i;
  }
  return result;
};

const recursiveFactorial = (() => {
  const innerRecursiveFactorial = (num, index) => {
    if (index > num) return 1;
    return index * innerRecursiveFactorial(num, index + 1);
  };

  return (num) => innerRecursiveFactorial(num, 1);
})();

console.log(recursiveFactorial(10));
console.log(imperativeFactorial(10));

// obtener un rango imperativo
const imperativeRange = (from, to) => {
  const result = [];
  while (from < to - 1) {
    result.push(++from);
  }
  return result;
};

// obtener rango declarativo
const declarativeRange = (from, to) => Array.from({ length: to - from - 1 }, (_, i) => i + from + 1)

// obtener rango recursivo
const recursiveRange = (() => {
  const recursiveInnerRange = (from, to, acc) => {
    if (from >= to - 1) return acc;
    acc.push(++from);
    return recursiveInnerRange(from, to, acc);
  };
  return (from, to) => recursiveInnerRange(from, to, []);
})();

const recursiveRangeAccumulator = (() => {
  const recursiveInnerRange = (from, to) => {
    if (from >= to - 1) return [];
    return [from + 1].concat(recursiveInnerRange(from + 1, to));
  };
  return (from, to) => recursiveInnerRange(from, to);
})();

console.log(imperativeRange(2, 9));
console.log(declarativeRange(2, 9));
console.log(recursiveRange(2, 9));
console.log(recursiveRangeAccumulator(2, 9));

