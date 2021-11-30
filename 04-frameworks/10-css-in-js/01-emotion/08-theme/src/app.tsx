import React from "react";
import { jsx, css, ThemeProvider, useTheme } from "@emotion/react";
import { MyComponent } from "./mycomponent";

interface MyTheme {
  colors: { primary: string };
}

const theme: MyTheme = {
  colors: {
    primary: "green",
  },
};

const globalStyles = css`
  .base-background {
    background-color: gray;
  }
`;

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <MyComponent />
    </ThemeProvider>
  );
};
