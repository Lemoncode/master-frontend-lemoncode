import { injectGlobal } from "emotion";
import AntonFont from "./assets/font/anton-regular.ttf";

injectGlobal`
  @font-face {
    font-family: "Anton";
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src:
      local('Anton'),
      local('Anton-Regular'),
      url(${AntonFont}) format('truetype');
  }

  body {
    margin: 0;
    padding: 0;
  }
`;
