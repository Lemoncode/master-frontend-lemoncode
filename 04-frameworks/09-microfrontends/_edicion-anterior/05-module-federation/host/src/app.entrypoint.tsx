import "./app.styles";
import React from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./app.router";

const App: React.FC = () => <AppRouter />;

const root = createRoot(document.getElementById("root"));
root.render(<App />);
