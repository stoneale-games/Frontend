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

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Lobby />,
      },
      {
        path: "personal",
        element: <Personal />,
      },
      {
        path: "wallet",
        element: <Wallet />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
