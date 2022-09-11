import React from "react";
import "./styles/index.css";
import "./config/configureMobX";

import App from "./app/App";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


if (module.hot) {
  module.hot.accept();
}