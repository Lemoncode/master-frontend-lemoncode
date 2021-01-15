import React from "react";
import { Link } from "react-router-dom";

export const DetailPage: React.FC = () => {
  return (
    <>
      <h2>Hello from Detail page</h2>
      <Link to="/list">Back to list page</Link>
    </>
  );
};
