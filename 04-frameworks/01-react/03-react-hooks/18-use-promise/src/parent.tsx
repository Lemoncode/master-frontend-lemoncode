import React, { Suspense } from "react";
import { useDebounce } from "use-debounce";
import { MyComponent } from "./demo";

export interface User {
  id: number;
  name: string;
}

const fetchUsers = async (filter): Promise<User[]> => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users?name_like=${filter}`
  );
  return res.json();
};

export const MyParentComponent = () => {
  const [filter, setFilter] = React.useState("");
  const [debouncedFilter] = useDebounce(filter, 1500);

  const usersPromise = React.useMemo(
    () => fetchUsers(debouncedFilter),
    [debouncedFilter]
  );

  return (
    <>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <Suspense fallback={<>Loading</>}>
        <MyComponent userPromise={usersPromise} />
      </Suspense>
    </>
  );
};
