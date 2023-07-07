- 00-boilerplate: Añadir pasos para montar boilerplate desde 0
- 01-reactivity:
    - [montar ejemplo basico de signal + createEffect usando document.createElement](https://dev.to/this-is-learning/react-vs-signals-10-years-later-3k71)
    - Pasarlo a JSX
    - Mover createSignal fuera del componente
    - Crear custom hook

- 02-props
    - Destructuring de las props (no funciona) 
    - // const {count} = props;
      // const count = props.count;

```
import { render } from "solid-js/web";
import { createSignal, Accessor } from "solid-js";

function App() {
  return (
    <>
      <MyComponent/>
    </>
    );
}

const useCount = () => {
  const [count, setCount] = createSignal(0);
  return {count, setCount};
}

function MyComponent() {

const {count, setCount} = useCount();
console.log("Render")

return (<>
  <button onClick={() => setCount(c => c+1)}>{count()}</button>
  <MyChild count={count()} />
</>)

}

interface Props {
  count: number
}

const MyChild = (props: Props) => {
  // const {count} = props;
  const count = props.count;
  return <span>{props.count}</span>
}

render(() => <App />, document.getElementById("app")!);

```

- 03-lifecycle
  - onMount
      ```
      function App() {
        let input: HTMLInputElement;
        const [value, setValue] = createSignal("");

        // onMount(() => {
        // });

        createEffect(() => {
          input.focus();
        })

        return (
          <>
            <input
              ref={(node) => {
                input = node;
              }}
              value={value()}
              onInput={e => setValue(e.currentTarget.value)}
            />
          </>
        );
      }
      ```
  - createEffect
      ```
        function App() {
          let input: HTMLInputElement;
          const [value, setValue] = createSignal("");

          onMount(() => {
            input.focus();
          })

          createEffect(() => {
            console.log(value())
          })

          return (
            <>
              <input
                ref={(node) => {
                  input = node;
                }}
                value={value()}
                onInput={e => setValue(e.currentTarget.value)}
              />
            </>
          );
        }
      ```
  - onCleanup (componente) 
    - Ojo que falta el `<Show>`
    ```
      function App() {
        const [isCheck, setCheck] = createSignal(false);
        return (
          <>
            <input
              type="checkbox"
              checked={isCheck()}
              onInput={e => setCheck(e.currentTarget.checked)}
            />
            <span>Show child</span>
            {isCheck() && <MyChild />}
          </>
        );
      }
      const MyChild = () => {
        onCleanup(() => {
          console.log("clean up")
        })
        return <p>Child component</p>;
      };
```

- 04-createEffect
   - Ojo que falta la parte del `on`
```
function App() {
  const [value, setValue] = createSignal("john");
  const [debouncedValue, setDebouncedValue] = createSignal();

createEffect(() => {
  const newValue = value();
  const timerId = setTimeout(() => {
    console.log("aa")
    setDebouncedValue(newValue)
  }, 500);
  onCleanup(() => {
    clearTimeout(timerId)
  })
})
  
  return (
    <>
    <input value={value()} onInput={(e) => setValue(e.currentTarget.value)} />
    <p>Debounced: {debouncedValue()}</p>
    </>
    );
}
```

- 05-fetching-data
  - createResource, <For> -> mismo ejemplo que `01-react/04-basic-app/03-list`
  
  `Why use <For>, etc`: If your array is static, there's nothing wrong with using map. But if you're looping over a signal or reactive property, map is inefficient: if the array changes for any reason, the entire map will rerun and all of the nodes will be recreated.
  [Reference](https://www.solidjs.com/guides/faq#why-shouldnt-i-use-map-in-my-template-and-whats-the-difference-between-for-and-index)

- 06-store
    - Mover del ejemplo anterior el memberList a un store
    - Añadir input dentro de la lista para  editar member name
    - Añadir contexto.
