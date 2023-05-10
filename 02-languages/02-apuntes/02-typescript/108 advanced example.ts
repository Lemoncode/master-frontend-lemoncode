///-- EJEMPLO AVANZADO ****************************************************************************

// Este es un ejemplo de una posible implementación de una función "get" que recibe un objeto y un
// número variable de propiedades y devuelve el valor del objeto en la ruta especificada.
// Se aplican tanto tipos condicionales, como inferencia y tipos mapeados

// Helpers
type Head<U> = U extends [infer R, ...any[]]
  ? R
  : never;

type Tail<U> = U extends [any, ...(infer R)]
  ? R
  : never;

// Declaración final
type DeepGet<O, T extends any[]> = Head<T> extends keyof O
  ? Tail<T> extends (never | [])
    ? O[Head<T>]
    : DeepGet<O[Head<T>], Tail<T>>
  : never;

// Ejemplo uso
// Se omite los detalles de la implementación de get
declare function get<O extends object, T extends (keyof any)[]>(obj: O, ...keys: T): DeepGet<O, T>;

const state = {
  left: 8,
  moves: 0,
  cards: [
    { id: "green-triangle", color: "green", shape: "triangle" },
    { id: "blue-square", color: "blue", shape: "square", selected: true },
    { id: "purple-circle", color: "purple", shape: "circle" },
  ],
  hint: { color: "green", shape: "triangle" },
  over: false,
  isCorrect: null as boolean | null,
  rank: 0,
};

// Prueba
const over = get(state, 'over'); // boolean
const hint = get(state, 'hint'); // {"color": string, "shape": string}
const selected = get(state, 'cards', 0, 'selected'); // boolean | undefined
const never1 = get(state, 'hint', 'id'); // never
const never2 = get(state); // never
const never3 = get(state, 'hint', ''); // never

