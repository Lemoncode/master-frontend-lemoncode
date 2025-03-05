import ReactDOM from "react-dom/client";
import { Terminal } from "./pods";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Terminal value="0123456" />
);
