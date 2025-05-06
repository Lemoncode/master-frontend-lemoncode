import React from 'react';
import { HashRouter, Routes, Route } from 'react-router';
import { NameCollection } from './name-collection';
import { UserEdit } from './user-edit';

export const Router: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<NameCollection />} />
        <Route path="users/:name" element={<UserEdit />} />
      </Routes>
    </HashRouter>
  );
};
