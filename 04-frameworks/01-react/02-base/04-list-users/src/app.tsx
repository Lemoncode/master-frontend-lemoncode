import React from "react";

export const App = () => {
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json())
      .then((json) => setMembers(json));
  }, []);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Avatar</th>
          <th>Id</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr>
            <td>
              <img src={member.avatar_url} style={{ width: "5rem" }} />
            </td>
            <td>
              <span>{member.id}</span>
            </td>
            <td>
              <span>{member.login}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
