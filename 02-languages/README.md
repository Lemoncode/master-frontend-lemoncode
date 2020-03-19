# 02 Languages

## JavaScript

### Summary

JavaScript was born as the scripting language for web pages. While HTML provides the structure of a website and CSS applies styling rules to it, we need a third ingredient to make our webs not only static text and images but full applications: JavaScript. JavaScript will provide us with behaviour, user interaction and the full power of a programming language.

As a language, we could define JavaScript as:

- Lightweight
- Dynamic
- Interpreted
- Multi-Paradigm (Functional, OOP, Imperative)
- Multi-Purpose
- Based on Objects

JavaScript has become one of the most popular and most used languages out there, and there is a good reason for that: it is the king of cross-platform development. Nowadays almost every device has an embedded browser, and thus, capabilities to run JavaScript applications. Furthermore, runtime environments like Node.js lets you run JavaScript on the server-side. But also desktop frameworks are becoming popular to make apps with JavaScript. This language is omnipresent!

JavaScript has evolved as a language since it was released for the first time and continue to do so in each release. JavaScript releases try to meet the rising demand for new features and capabilities. ES5 release is considered the baseline of the language, as every modern web browser is compatible with it. We refer to ES6+ or ESNext to all the new features that were relased from ES6 onwards.

We will discover all the main features of the language, from fundamentals (ES5) to advance (ES6+), using code snippets and examples.

### Table of contents

- Introduction.
- JavaScript Fundamentals.
  - Basics.
    - Data Types.
    - Operators.
    - Type Coercion.
    - Flow Control.
  - Data Structures.
    - Objects.
    - Arrays.
  - Hoisting.
  - Variable Scope.
  - Closure.
  - Prototype Model.
  - JSON.
- JavaScript ESNext.
  - Let and Const.
  - Arrow Functions.
  - Classes.
  - Destructuring.
  - Spread and Rest operators.
  - Default Arguments.
  - Template Literals.
  - Map and Set.
  - Symbol.
  - Modules.
  - Introduction to Promises.

## TypeScript

### Summary

JavaScript is a powerful language with a huge flexibility. given its weakly-typed nature. Programming under a dynamically typed language like JavaScript may feel fast and productive at a first sight, you don't have to worry about types anymore, right?.

However, that advantage may turn into a pain when unexpected run-time errors arise. In large codebases with code shared among team members is crucial to be able to correctly answers questions like: "what kind of arguments does that function accept?", "can I pass a null or undefined value?", "what type of value does it return?". If we don't have a proper type system implemented in our code, those questions become suppositions.

Building a large front-end project is a challenge involving effective and efficient development to properly manage deadlines and budget. Under these circumstances, being a productive developer is more important than ever and investing some time in creating a type safe code will save you hours of debugging and will reduce the possibilities of unexpected bugs in production. That's where TypeScript comes in.

Typescript adds static types to JavaScript. Imagine a JavaScript on steroids that will nicely allow you to type whatever you need: variables, function arguments and return values, objects, classes, and many more. In short, it will allow you to make your code robust and safe.

In this sessions we will focus on exploring each topic of Typescript, its syntax and usage through concise examples, from the basics to advanced types.

### Table of contents

- Introduction.
- Basics.
  - Type annotation.
  - Basic types.
    - Boolean.
    - Number.
    - String.
    - Array.
    - Tuple.
    - Enum.
    - Void.
    - Null & Undefined.
    - Never.
    - Any.
  - Type Assertion.
- Interfaces.
  - Syntax.
  - Optional properties.
  - Read-only properties.
  - Extending interfaces.
  - Duck Typing.
- Classes.
  - Syntax.
  - Access operators: public, private and protected.
  - Static properties.
  - Abstract classes.
  - Constructor shorthands.
- Functions.
  - Syntax.
  - Optional arguments.
  - Default arguments.
  - Extracting function type to an Alias.
  - Functions as arguments.
  - Function overloading.
  - Typing functions through an interface.
- Generics.
  - Syntax.
  - Generic functions.
  - Generic interfaces.
  - Generic classes.
- Advanced types.
  - Intersection.
  - Union.
  - Disambiguation Guards.
    - User defined guards: duck typing and type predicate.
    - Typeof guards.
    - Instanceof guards.
  - Alias.
  - String literals.
  - Numeric literals.
  - Keyof.
  - Conditional Types.
- Utility types.
  - Partial.
  - Required.
  - Readonly.
  - Record.
  - Pick.
  - Omit.
  - Return type.
