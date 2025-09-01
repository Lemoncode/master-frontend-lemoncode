import React, { use } from "react";
import { User } from "./app";

interface MyComponentProps {
  usersPromise: Promise<User[]>;
}

export const MyComponent: React.FC<MyComponentProps> = ({ usersPromise }) => {
  const users = use(usersPromise);

  return (
    <div>
      <ul>
        {users?.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
