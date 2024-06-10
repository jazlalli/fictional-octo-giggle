import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import "@radix-ui/themes/styles.css";
import "./index.css";

async function enableMocking() {
  const { worker } = await import("./backend/api");
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Theme accentColor="violet" grayColor="slate">
        <App />
      </Theme>
    </React.StrictMode>,
  );
});
