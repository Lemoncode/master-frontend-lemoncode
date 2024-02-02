# Lifecycle Hooks

Working with Qwik requires a new mental schema. Resumability makes that code runs first on server and paused and then gets resumed on client. We have APIs / methods to track the state, react to changes, run code on server, or force to run on client.

- useTask$()
- useVisibleTask$()
- useSignal()