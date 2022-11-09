import React from "react";
import logo from "./content/logo_2.png";
import * as classes from "./app.styles";

export const App: React.FC = () => {
  const [enlace, setEnlace] = React.useState("");

  return (
    <div className={classes.root}>
      <h1>Ataque Cross Site Scripting(XSS) con React ejercicio 2</h1>
      <div className={classes.formContainer}>
        <label htmlFor="enlace" className={classes.label}>Introduzca un enlace:</label>
        <input
          value={enlace}
          name="enlace"
          onChange={(e) => setEnlace(e.target.value)}
          className={classes.input}
        />

        <a href={enlace} className={classes.button}>
          Ir al enlace
        </a>
      </div>
      <img src={logo} alt="logo" className={classes.image} />
    </div>
  );
};
