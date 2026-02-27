import { FC, useEffect, useState } from "react";

export const HelloComponent: FC = () => {
  const [counter, setCounter] = useState(0);

   useEffect(() => {
     const timer = setInterval(() => {
       setCounter(prev => prev + 1);
     }, 1_000);

     return () => clearInterval(timer);
   }, []);

  return (
    <>
      <h2>Hello from React</h2>
      <p>Counter state: {counter}</p>
    </>
  );
};
