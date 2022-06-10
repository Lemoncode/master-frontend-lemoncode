import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RouterComponent } from "@/core";
import { ProfileProvider } from "@/core/profile";

export const App = () => {
  return (
    <ProfileProvider>
      <RouterComponent />
    </ProfileProvider>
  );
};
