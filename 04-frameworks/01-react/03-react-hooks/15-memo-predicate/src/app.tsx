import React from "react";
import { MyComponent } from "./demo";

export const App = () => {
  const [satisfactionLevel, setSatisfactionLevel] = React.useState(300);

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column" }}>
      <input
        type="range"
        min="0"
        max="500"
        value={satisfactionLevel}
        onChange={(event) => setSatisfactionLevel(+event.target.value)}
      />
      <span>{satisfactionLevel}</span>
      <MyComponent level={satisfactionLevel} />
    </div>
  );
};
