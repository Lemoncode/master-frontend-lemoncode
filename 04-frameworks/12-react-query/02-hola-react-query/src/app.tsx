import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { TodoPage, ListPage } from "./pages";
import { queryClient } from "./core/query/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<TodoPage />} />
            <Route path="/pageb" element={<ListPage />} />
          </Routes>
        </HashRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
};
