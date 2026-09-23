import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '#core/router';
import { ThemeProviderComponent } from '#core/theme';

const App: React.FC = () => {
  return (
    <ThemeProviderComponent>
      <RouterProvider router={router} />
    </ThemeProviderComponent>
  );
};

export default App;
