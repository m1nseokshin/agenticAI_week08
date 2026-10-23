import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@seed-design/css/base.css";
import "./styles.css";
import { MainPage } from "./pages/MainPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainPage />
  </StrictMode>,
);
