import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/list");
  };

  return (
    <>
      <h2>Hello from login page</h2>
      <button onClick={handleNavigation}>Login</button>
    </>
  );
};
