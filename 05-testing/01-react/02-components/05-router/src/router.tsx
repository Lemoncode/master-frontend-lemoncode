import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { NameCollection } from './name-collection';
import { UserEdit } from './user-edit';

export const Router: React.FunctionComponent = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<NameCollection />} />
        <Route path="users/:name" element={<UserEdit />} />
      </Routes>
    </HashRouter>
  );
};
