import "./app.styles";
import React from "react";
import { createRoot } from "react-dom/client";
import { Clock  } from "./components";

const App: React.FC = () => <Clock />;

const root = createRoot(document.getElementById("root"));
root.render(<App />);
