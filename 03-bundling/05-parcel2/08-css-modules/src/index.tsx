import { createRoot } from "react-dom/client";
import { HelloComponent } from "./hello.jsx";
import { ByeComponent } from "./bye.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <div>
    <HelloComponent />
    <ByeComponent />
  </div>
);
