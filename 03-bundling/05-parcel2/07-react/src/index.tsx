import { createRoot } from "react-dom/client";
import { HelloComponent } from "./hello.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <div>
    <HelloComponent />
  </div>
);
