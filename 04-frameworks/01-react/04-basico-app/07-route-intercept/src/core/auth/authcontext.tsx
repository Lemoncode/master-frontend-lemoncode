import React from "react";

interface Context {
  userInfo: string;
  setUserInfo: (user: string) => void;
}

export const AuthContext = React.createContext<Context>({
  userInfo: "",
  setUserInfo: (user: string) =>
    console.log("Did you forgot to add AuthContext on top of your app?"),
});

export const AuthProvider: React.FunctionComponent = (props) => {
  const { children } = props;
  const [userInfo, setUserInfo] = React.useState<string>("");

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
