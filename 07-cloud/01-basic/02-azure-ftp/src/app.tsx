import React from 'react';
import { RouterComponent } from 'core/router';
import { ThemeProviderComponent } from 'core/theme';

const App: React.FC = () => {
  return (
    <ThemeProviderComponent>
      <RouterComponent />
    </ThemeProviderComponent>
  );
};

export default App;
