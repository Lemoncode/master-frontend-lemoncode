import _ from 'lodash/fp';

// Ejemplo 1
// Suponed que tenemos un objeto que representa las notas finales de un estudiante de secundaria y queremos orientarle para elegir una modalidad de bachillerato en función de qué se le da mejor:
var student = {
  literature: 0,
  maths: 0,
  biology: 0,
  chemistry: 0,
  history: 0,
  classicalCulture: 0,
  plasticEducation: 0,
  music: 0
};

// The non-lodash-way

// 1. Crear funcion "Es bueno en"
var isGoodAtSubject = (value) => value > 6;
var isScienceCandidate = (student) => (
  isGoodAtSubject(student.maths) &&
  isGoodAtSubject(student.biology) &&
  isGoodAtSubject(student.chemistry)
);

// 2. Crear funciones de candidatos
var isHumanityCandidate = (student) => (
  isGoodAtSubject(student.literature) &&
  isGoodAtSubject(student.history) &&
  isGoodAtSubject(student.classicalCulture)
);

var isArtCandidate = (student) => (
  isGoodAtSubject(student.music) &&
  isGoodAtSubject(student.plasticEducation)
);

var isGoodAtAll = (student) => (
  isScienceCandidate(student) &&
  isHumanityCandidate(student) &&
  isArtCandidate(student)
);

// 3. Crear función principal
var getSpecialization = (student) => {
  if (isGoodAtAll(student)) {
    return 'any';
  } else if (isScienceCandidate(student)) {
    return 'science';
  } else if (isHumanityCandidate(student)) {
    return 'humanity';
  } else if (isArtCandidate(student)) {
    return 'art';
  } else {
    return 'none';
  }
};

// Probar resultados:
console.log(
  getSpecialization({
    literature: 0,
    maths: 7,
    biology: 9,
    chemistry: 7,
    history: 0,
    classicalCulture: 0,
    plasticEducation: 0,
    music: 0
  })
);

// FP-way

// 1. Crear funcion "Es bueno en"
var isGreaterThan6 = _.partialRight(_.gt, [6]);
var isGoodAt = subject => _.flow(_.get(subject), isGreaterThan6);

// 2. Crear funciones de candidatos
var isScienceCandidate = _.allPass([
  isGoodAt("maths"),
  isGoodAt("biology"),
  isGoodAt("chemistry")
]);

var isHumanityCandidate = _.allPass([
  isGoodAt("literature"),
  isGoodAt("history"),
  isGoodAt("classicalCulture")
]);

var isArtCandidate = _.allPass([
  isGoodAt("plasticEducation"),
  isGoodAt("music")
]);

var isGoodAtAll = _.allPass([
  isScienceCandidate,
  isHumanityCandidate,
  isArtCandidate
]);

// 3. Crear función principal
var getSpecialization = _.cond([
  [isGoodAtAll, _.constant("any")],
  [isScienceCandidate, _.constant("science")],
  [isHumanityCandidate, _.constant("humanity")],
  [isArtCandidate, _.constant("art")],
  [_.T, _.constant("none")]
]);

// Probar resultados:
console.log(
  getSpecialization({
    literature: 0,
    maths: 7,
    biology: 9,
    chemistry: 7,
    history: 0,
    classicalCulture: 0,
    plasticEducation: 0,
    music: 0
  })
);


// Ejemplo 2
// Suponed que queremos hacer lo siguiente: Tenemos un array de estudiantes y queremos transformar los datos de la siguiente
//manera: necesitamos un objeto que contenga el nombre de todos los estudiantes aprobados agrupados por clase:

var students = [
  { name: "John", grades: [7.0, 6.9, 8.0], group: "A" },
  { name: "Paul", grades: [5.0, 8.7, 3.7], group: "A" },
  { name: "Alex", grades: [5.0, 4.7, 3.7], group: "A" },
  { name: "Luke", grades: [9.0, 8.2, 6.2], group: "B" },
  { name: "Mark", grades: [6.0, 9.0, 8.4], group: "B" },
  { name: "Alice", grades: [3, 4.7, 4.5], group: "B" },
  { name: "Harvey", grades: [1.5, 6.6, 3], group: "C" },
  { name: "Nina", grades: [6.9, 4.4, 7], group: "C" },
  { name: "Evan", grades: [1.2, 6.8, 1.7], group: "C" },
];

// Queremos el siguiente resultado:
/*
{
  "A": ["John", "Paul"],
  "B": ["Luke", "Mark"],
  "C": ["Nina"]
}
*/


// Ejemplo sin lodash

// 1. Crear funcion media
var sum = (total, grade) => total + grade;
var sumGrades = (grades) => grades.reduce(sum);
var mean = (grades) => sumGrades(grades) / grades.length;

// 2. Crear funcion para saber quién aprueba
var isApproved1 = (student) => mean(student.grades) >= 5;

// 3. Crear funcion que crea el objeto resultado
var reducer = (all, { name, group }) => {
  all[group] = (all[group] || []).concat(name);
  return all;
};

// 4. Crear funcion principal
var getApprovedStudentsNameByClass1 = (students) => students
  .filter(isApproved1)
  .reduce(reducer, {})

// 5. Comprobar resultados
var result = getApprovedStudentsNameByClass1(students);
console.log(result);
// { A: ['John', 'Paul'], B: ['Luke', 'Mark'], C: ['Nina'] }


// Versión con lodash/fp

// 1. Crear funcion para saber quién aprueba
var isApproved = _.flow(
  _.mean,
  _.gte(_.__, 5),
);

// Crear función principal
var getApprovedStudentsNameByClass = _.flow(
  _.filter(_.conformsTo({ grades: isApproved })),
  _.groupBy('group'),
  _.mapValues(_.map('name')),
);

// Comprobar resultados
var result = getApprovedStudentsNameByClass(students);
console.log(result);
// { A: ['John', 'Paul'], B: ['Luke', 'Mark'], C: ['Nina'] }
