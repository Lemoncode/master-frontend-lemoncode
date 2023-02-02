import "./app.styles";
import React from "react";
import { createRoot } from "react-dom/client";
import { Dashboard } from "./dashboard.component";

const App: React.FC = () => <Dashboard />;

const root = createRoot(document.getElementById("root"));
root.render(<App />);
