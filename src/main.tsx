import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "virtual:generated-pages-react";
import Layout from "./components/layout";
import "./index.css";

const router = createBrowserRouter(
  routes.map((route) => ({
    ...route,
    element: <Layout data-oid="dtul:yb">{route.element}</Layout>,
  })),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode data-oid="su_.txf">
    <RouterProvider router={router} data-oid="rn3ejtl" />
  </React.StrictMode>,
);
