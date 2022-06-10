import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import {CenterLayout} from '@/layouts';
import { ProfileContext } from "@/core/profile";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { setUserProfile } = React.useContext(ProfileContext);

  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === "admin" && password === "test") {
      setUserProfile({ userName: username });
      navigate(routes.list);
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };

  return (
    <CenterLayout>
      <form onSubmit={handleNavigation}>
        <h2>Hello from login page</h2>

        <div>
          <div>
            <label>Username: </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit">Login</button>
      </form>
      </CenterLayout>
  );
};
