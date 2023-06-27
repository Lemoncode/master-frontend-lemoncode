import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { TodoPage, ListPage } from "./pages";

export const App = () => {
  return (
    <>
      {/* Ponemos el provider de React Query para que wrapee la aplicación completa */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/pageb" element={<ListPage />} />
        </Routes>
      </HashRouter>
      {/* Decimos que vamos a usar las dev tools, por defecto en producción no se ve*/}
      {/* Es un paquete externo, mirar package.json */}
    </>
  );
};
