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

### Table of Contents

- Introduction.
- JavaScript Core.
  - Basics.
    - Data Types.
    - Operators.
    - Type Coercion.
    - Flow Control.
  - Data Structures.
    - Objects.
    - Arrays.
    - Mutability
  - Functions.
    - Classic functions.
    - Arrow functions.
    - Introduction to this keyword.
  - Optional chaining & nullish coalescing.
  - Destructuring.
  - Spread and Rest operators.
  - Default Arguments.
  - Classes.
  - JSON.
  - Error Handling.
  - Modules.
- JavaScript Advanced.
  - Prototype Model.
    - Constructor functions, new operator and the prototype.
    - Prototypal inheritance (prototype chain).
    - Default constructors.
    - This keyword and its problems.
    - Getters and setters.
  - Advanced classes.
    - Syntactic sugar.
    - Class factory.
  - Asyncronous javascript.
    - Callbacks.
    - Promises.
    - Async / await.
  - Advanced variables.
    - Hoisting.
    - Var: hoisting and scope.
    - Let & const: hoisting and scope.
  - Advanced functions.
    - Function declaration vs function expression.
    - Closure.
    - IIFE.
  - Tagged templates.
  - Map & WeakMap.
  - Set & WeakSet.
  - Symbol.

### Extra Content

- JavaScript Functional Approach.
  - Array Methods.
  - Recursion.
  - Composition.
  - Curry.
  - Partial Application.

## TypeScript

### Summary

JavaScript is a powerful language with a huge flexibility. given its weakly-typed nature. Programming under a dynamically typed language like JavaScript may feel fast and productive at a first sight, you don't have to worry about types anymore, right?.

However, that advantage may turn into a pain when unexpected run-time errors arise. In large codebases with code shared among team members is crucial to be able to correctly answers questions like: "what kind of arguments does that function accept?", "can I pass a null or undefined value?", "what type of value does it return?". If we don't have a proper type system implemented in our code, those questions become suppositions.

Building a large front-end project is a challenge involving effective and efficient development to properly manage deadlines and budget. Under these circumstances, being a productive developer is more important than ever and investing some time in creating a type safe code will save you hours of debugging and will reduce the possibilities of unexpected bugs in production. That's where TypeScript comes in.

Typescript adds static types to JavaScript. Imagine a JavaScript on steroids that will nicely allow you to type whatever you need: variables, function arguments and return values, objects, classes, and many more. In short, it will allow you to make your code robust and safe.

In this sessions we will focus on exploring each topic of Typescript, its syntax and usage through concise examples, from the basics to advanced types.

### Table of Contents

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

### Extra Content

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

## Functional Programming

### Summary

Functional Programming is a style of coding tha's been growing in popularity in the last few years. It introduces mathematical approach of solving problems and new concepts like partial application, composition, immutability, and more.

In this lesson we will learn how to apply these concepts using JavaScript in the form of functions and small constraints in order to explore how we can take advantage of this paradigm.

### Table of contents

- Introduction.
- Summary of Features.
- FP vs OOP.
- Immutability.
- High Order Functions.
- Recursivity.
- Pure Functions.
- Functional Composition.
- Currying & Partial application.

## Lodash

### Summary

Lodash was born as a fork of Underscore but it became in one of most popular JavaScript libraries of all time. It provides a good amount of battle tested utility functions for daily use.

In this lesson we will unleash Lodash power and explore some of its most used functions, advantages or disadvantages of using this library and how to integrate it in a modern software development project.

### Table of contents

- Introduction.

- API.

  - Lang.
  - Strings.
  - Array.
  - Collections.
  - Objects.
  - Functions.

- Functional Programming with Lodash functions.

- Usage & bundling in modern projects.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
