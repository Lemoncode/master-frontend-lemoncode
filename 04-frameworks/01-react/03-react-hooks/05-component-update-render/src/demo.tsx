import React from "react";

export const MyComponent = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <button onClick={() => setVisible(!visible)}>
        Toggle Child component visibility
      </button>
      {visible && <MyChildComponent />}
    </>
  );
};

const MyChildComponent = () => {
  const [userInfo, setUserInfo] = React.useState({
    name: "John",
    lastname: "Doe",
  });

  React.useEffect(() => {
    console.log(`Effect ran: component rendered with name: ${userInfo.name}`);
    return () =>
      console.log(`Cleanup before running new effect, name: ${userInfo.name}`);
  }, [userInfo.name]);

  React.useEffect(() => {
    console.log(
      `Effect ran: component rendered with lastname: ${userInfo.lastname}`
    );
    return () =>
      console.log(
        `Cleanup before running new effect, lastname: ${userInfo.lastname}`
      );
  }, [userInfo.lastname]);

  return (
    <div>
      <h3>
        {userInfo.name} {userInfo.lastname}
      </h3>
      <input
        value={userInfo.name}
        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
      />
      <input
        value={userInfo.lastname}
        onChange={(e) => setUserInfo({ ...userInfo, lastname: e.target.value })}
      />
    </div>
  );
};
