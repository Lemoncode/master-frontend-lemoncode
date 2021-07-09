import "./app.styles";
import React from "react";
import ReactDOM from "react-dom";
import { AppRouter } from "./app.router";

const App: React.FC = () => <AppRouter />;

ReactDOM.render(<App />, document.getElementById("root"));
