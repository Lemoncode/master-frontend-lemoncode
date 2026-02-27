import React from "react";

interface Props {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  style?: React.CSSProperties;
}

export const App: React.FC<Props> = (props) => {
  const { count = 0, setCount, style } = props;
  return (
    <div>
      <h2>Microfrontend 2</h2>
      <p
        style={{
          backgroundColor: style?.backgroundColor || "lightblue",
        }}
      >
        This mfe is using Rsbuild and React {React.version}
      </p>
      <button
        onClick={() => {
          if (setCount) {
            setCount(count + 1);
          }
        }}
      >
        Count is {count}
      </button>
    </div>
  );
};
