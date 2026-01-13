import React from "react";
import { useState } from "react";
import "./design-tokens.css";
import styles from "./CounterApp.module.css";

const CounterApp = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.container}>
      <h2>React Counter Component</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default CounterApp;
