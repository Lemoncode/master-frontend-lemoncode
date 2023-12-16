import React from "react";
import { OrganizationFilterContext } from "./organization-filter.context";

interface Props {
  children: React.ReactNode;
}

export const OrganizationFilterProvider: React.FC<Props> = ({ children }) => {
  const [filter, setFilter] = React.useState("");
  return (
    <OrganizationFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </OrganizationFilterContext.Provider>
  );
};
