import ReactDOM from "react-dom/client";
import { KeyPad } from "./pods";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <KeyPad
    dispatchEvent={(name, detail) => {
      console.log({ name, detail });
    }}
  />
);
