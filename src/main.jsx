import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Messages from "./Messages.jsx";
import "./App.css";
import { ThemeProvider } from "./ThemeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/messages/:username" element={<Messages />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
