import React from "react";
import * as classes from "./app.styles";
import logo from "./content/logo_2.png";

export const App: React.FC = () => {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOutput(`Input Value: ${input}`);
    setInput("");
  };

  return (
    <div className={classes.root}>
      <h1>Ataque Cross Site Scripting(XSS) con React</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.formContainer}>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            className={classes.input}
            value={input}
          />
          <button type="submit" className={classes.button}>
            Submit
          </button>
        </div>
      </form>

			<h2 dangerouslySetInnerHTML={{ __html: output }}></h2>
      <img src={logo} alt="logo" className={classes.image} />
    </div>
  );
};
