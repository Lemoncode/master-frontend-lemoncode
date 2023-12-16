import { createContext, useContext } from "react";

interface ContextProps {
  filter: string;
  setFilter: (filter: string) => void;
}

// asignamos un objeto por si el filtro crece en un futuro
export const OrganizationFilterContext = createContext<ContextProps | null>(
  null
);

export const useOrganizationFilterContext = (): ContextProps => {
  const context = useContext(OrganizationFilterContext);
  if (!context) {
    throw new Error(
      "useOrganizationFilterContext must be used within a OrganizationFilterProvider"
    );
  }
  return context;
};
