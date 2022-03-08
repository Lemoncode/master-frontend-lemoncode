import React from 'react';
import { RouterComponent } from 'core/router';
import { ThemeProviderComponent } from 'core/theme';

const App: React.FunctionComponent = () => {
  return (
    <ThemeProviderComponent>
      <RouterComponent />
    </ThemeProviderComponent>
  );
};

export default App;
