import "./App.css";
import { Router } from "@/core/routing";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/core/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { OrganizationFilterProvider } from "@/pods/github-collection/providers";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrganizationFilterProvider>
        <Router />
      </OrganizationFilterProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
