import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ComplaintProvider } from "./context/ComplaintContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ComplaintProvider>
      <App />
    </ComplaintProvider>
  </React.StrictMode>
);