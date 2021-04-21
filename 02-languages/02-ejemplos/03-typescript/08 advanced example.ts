///-- EJEMPLO AVANZADO **************************************************

// Este es un ejemplo de una posible implementación de una función "get"
// que recibe un objeto y un número variable de propiedades y devuelve
// el valor del objeto en la ruta especificada

// Se aplican tanto tipos condicionales, como inferencia, tipos mapeados,
// indexados y "middle man types" (o tipos creados al vuelo)

// Helpers
type DeepKeys<O extends object> = keyof O | {
  [P in keyof O]: O[P] extends object ? DeepKeys<O[P]> : keyof O[P];
}[keyof O]

type Head<U> = U extends [any, ...any[]]
  ? ((...args: U) => any) extends (head: infer H, ...args: any) => any
  ? H
  : never
  : never;
type Tail<U> = U extends [any, any, ...any[]]
  ? ((...args: U) => any) extends (head: any, ...args: infer T) => any
  ? T
  : never
  : never;

// Declaración final
type DeepGet<O, T extends any[]> = Head<T> extends keyof O
  ? {
    'base': O[Head<T>];
    'recursive': DeepGet<O[Head<T>], Tail<T>>;
  }[Tail<T> extends never ? 'base' : 'recursive']
  : never;


// Ejemplo uso
// Se omite los detalles de la implementación de get
declare function get<O extends object, T extends (keyof any)[]>(obj: O, ...[prop, ...rest]: T): DeepGet<O, T>;

const state = {
  left: 8,
  moves: 0,
  cards: [
    { id: "green-triangle", color: "green", shape: "triangle" },
    { id: "blue-square", color: "blue", shape: "square", selected: true },
    { id: "purple-circle", color: "purple", shape: "circle" }
  ],
  hint: { color: "green", shape: "triangle" },
  over: false,
  isCorrect: null as boolean | null,
  rank: 0
};

// Prueba
const over = get(state, 'over'); // boolean
const hint = get(state, 'hint'); // {"color": string, "shape": string}
const selected = get(state, 'cards', 0, 'selected'); // boolean | undefined
const never1 = get(state, 'hint', 'id'); // never
const never2 = get(state); // never
const never3 = get(state, 'hint', ''); // never

