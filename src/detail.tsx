import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@seed-design/css/base.css";
import "./styles.css";
import { DetailPage } from "./pages/DetailPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DetailPage />
  </StrictMode>,
);
