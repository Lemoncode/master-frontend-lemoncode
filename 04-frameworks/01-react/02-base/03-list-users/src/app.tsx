import React from "react";

export const App = () => {
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json())
      .then((json) => setMembers(json));
  }, []);

  return (
    <div className="user-list-container">
      <span className="header">Avatar</span>
      <span className="header">Id</span>
      <span className="header">Name</span>
      {members.map((member) => (
        <>
          <img src={member.avatar_url} />
          <span>{member.id}</span>
          <span>{member.login}</span>
        </>
      ))}
    </div>
  );
};
