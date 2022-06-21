import React from 'react';
import { ThemeProviderComponent } from 'core/theme';
import { RouterComponent } from 'core/router';
import { SessionProvider } from 'core/session-context';

interface AppProvidersProps {
  children: React.ReactNode;
}
const AppProviders: React.FC<AppProvidersProps> = (props) => {
  const { children } = props;
  return (
    <ThemeProviderComponent>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProviderComponent>
  );
};

const App: React.FC = () => {
  return (
    <AppProviders>
      <RouterComponent />
    </AppProviders>
  );
};

export default App;
