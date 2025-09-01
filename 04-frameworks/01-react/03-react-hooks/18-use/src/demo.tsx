import React, { use } from "react";
import { User } from "./parent";

interface MyComponentProps {
  userPromise: Promise<User[]>;
}

export const MyComponent: React.FC<MyComponentProps> = ({ userPromise }) => {
  const userCollection = use(userPromise);

  return (
    <div>
      <ul>
        {userCollection.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
