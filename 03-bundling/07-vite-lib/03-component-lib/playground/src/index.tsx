import { createRoot } from "react-dom/client";
import "@lemoncode/common-library/style.css";
import { Button } from "@lemoncode/common-library";

const root = createRoot(document.getElementById("root")!);
root.render(<Button />);
