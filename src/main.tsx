import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Lobby from "./pages/Lobby.tsx";
import Personal from "./pages/Personal.tsx";
import Wallet from "./pages/Wallet.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { WagmiProvider } from "wagmi";
import { config } from "../config.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ApolloProviderWrapper from "./providers/ApolloWrapper.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary>
            <Lobby />
          </ErrorBoundary>
        ),
      },
      {
        path: "personal",
        element: (
          <ErrorBoundary>
            <Personal />
          </ErrorBoundary>
        ),
      },
      {
        path: "wallet",
        element: (
          <ErrorBoundary>
            <Wallet />
          </ErrorBoundary>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ApolloProviderWrapper>
            <ThemeProvider>
              <RouterProvider router={router} />
            </ThemeProvider>
          </ApolloProviderWrapper>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
