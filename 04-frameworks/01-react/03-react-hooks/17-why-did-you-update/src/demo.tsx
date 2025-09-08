import React from "react";

// Hook
function useWhyDidYouUpdate(name, props) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = React.useRef(null);

  React.useEffect(() => {
    if (previousProps.current) {
      console.log(previousProps.current);
      // Get all keys from previous and current props
      const allKeys = Object.keys({
        ...(previousProps.current as any),
        ...props,
      });

      // Use this object to keep track of changed props
      const changesObj = {};
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        if (
          previousProps &&
          previousProps.current &&
          previousProps.current[key] !== props[key]
        ) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj);
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}

const name = {
  firstname: "John",
  lastname: "Doe",
};

export const MyComponent = () => {
  const [cont, setCont] = React.useState(0);
  const [id, setId] = React.useState(0);

  return (
    <div>
      <div>
        <MyChildComponent name={name} cont={cont} />
        <button onClick={() => setCont(cont + 1)}>Increment cont</button>
      </div>

      <div>
        <div>id: {id}</div>
        <button onClick={() => setId(id + 1)}>Increment id</button>
      </div>
    </div>
  );
};

interface Name {
  firstname: string;
  lastname: string;
}

interface Props {
  name: Name;
  cont: number;
}

export const MyChildComponent: React.FC<Props> = React.memo((props) => {
  useWhyDidYouUpdate("MyChildComponent", props);

  return (
    <div>
      {props.name.firstname} {props.name.lastname} cont: {props.cont}
    </div>
  );
});
