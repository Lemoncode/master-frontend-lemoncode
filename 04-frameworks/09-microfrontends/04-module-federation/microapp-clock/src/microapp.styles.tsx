import { injectGlobal } from "emotion";
import PoppinsFont from "./assets/font/poppins-regular.ttf";

injectGlobal`
  @font-face {
    font-family: "Poppins";
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src:
      local('Poppins'),
      local('Poppins-Regular'),
      url(${PoppinsFont}) format('truetype');
  }
`;
