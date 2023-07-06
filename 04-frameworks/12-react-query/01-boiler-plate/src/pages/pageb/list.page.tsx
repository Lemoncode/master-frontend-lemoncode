import React from "react";
import { Link } from "react-router-dom";

export const ListPage: React.FC = () => {
  return (
    <>
      <h1>Page B</h1>
      <Link to="/">To ToDo</Link>
    </>
  );
};
