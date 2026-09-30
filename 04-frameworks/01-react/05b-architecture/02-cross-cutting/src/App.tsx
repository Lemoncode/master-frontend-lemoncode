import { AuthProvider } from "#core/auth";
import { Router } from "#core/router";

const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};

export default App;
