import React from "react";

interface UserContext {
  username: string;
  setUsername: (value: string) => void;
}

const MyContext = React.createContext({
  username: "",
  setUsername: (value) => {},
});

export const MyContextProvider = (props) => {
  const [username, setUsername] = React.useState("John Doe");

  return (
    <MyContext.Provider value={{ username, setUsername }}>
      {props.children}
    </MyContext.Provider>
  );
};

export const MyComponent = () => {
  const myContext = React.useContext(MyContext);

  return (
    <>
      <h3>{myContext.username}</h3>
    </>
  );
};
