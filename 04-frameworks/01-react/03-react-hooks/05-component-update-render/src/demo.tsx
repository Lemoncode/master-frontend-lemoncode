import React from "react";

export const Demo: React.FC = () => {
  const [value, setValue] = React.useState("John");

  React.useEffect(() => {
    console.log("EFFECT", value);
    return () => console.log("CLEAN-UP", value);
  }, [value]);

  return (
    <>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>
    </>
  );
};
