import { createRoot } from "react-dom/client";
import { HelloComponent } from "./hello";
import "./styles.css";

const root = createRoot(document.getElementById("root"));

root.render(<HelloComponent />);
