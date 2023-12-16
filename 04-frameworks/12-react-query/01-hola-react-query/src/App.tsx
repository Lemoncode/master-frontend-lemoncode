import "./App.css";
import { Router } from "@/core/routing";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/core/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
