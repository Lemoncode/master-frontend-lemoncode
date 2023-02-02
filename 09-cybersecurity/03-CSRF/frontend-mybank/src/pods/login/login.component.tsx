import React from "react";
import { Credential, createEmptyCredential } from "./login.vm";
import headerLogo from "core/content/img/logo_header.svg";

interface Props {
  onSubmit: (credential: Credential) => void;
}

export const Login: React.FC<Props> = (props) => {
  const { onSubmit } = props;

  const [credential, setCredential] = React.useState<Credential>(
    createEmptyCredential()
  );

  const updateFieldValue = (name: keyof Credential) => (e) => {
    setCredential({ ...credential, [name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(credential);
  };

  return (
    <div className="login">
      <header className="header">
        <img src={headerLogo} className="login_logo" alt="header logo" />
      </header>
      <div className="bg-img"></div>
      <div className="login_box">
        <h1>Acceso</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            onChange={updateFieldValue("email")}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            onChange={updateFieldValue("password")}
          />
          <p>¿has olvidado tu contraseña?</p>
          <button type="submit" className="btn_enviar">
            Login
          </button>
        </form>
        <h4>
          Está Usted en un <strong>sitio seguro</strong>
        </h4>
      </div>
    </div>
  );
};
