import "./app.styles";
import React from "react";
import { createRoot } from "react-dom/client";
import { Quote } from "./components";

const App: React.FC = () => <Quote />;

const root = createRoot(document.getElementById("root"));
root.render(<App />);
