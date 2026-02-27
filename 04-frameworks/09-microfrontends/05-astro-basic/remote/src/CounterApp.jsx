import React, { useState } from "react";

const CounterApp = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "10px", border: "1px solid blue" }}>
      <h2>React Counter Component</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default CounterApp;
