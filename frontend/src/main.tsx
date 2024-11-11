import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

// import App from './App.tsx'

import router from "./routes/router";

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        {/* <App /> */}
        <RouterProvider router={router} />
      </QueryClientProvider>
  </StrictMode>
);
