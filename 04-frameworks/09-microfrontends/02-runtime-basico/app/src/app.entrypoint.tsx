import "./app.styles";
import React from "react";
import ReactDOM from "react-dom";
import { Dashboard } from "./dashboard.component";

const App: React.FC = () => <Dashboard />;

ReactDOM.render(<App />, document.getElementById("root"));
