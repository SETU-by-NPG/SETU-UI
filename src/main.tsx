import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Failed to find the root element. Check that index.html has <div id='root'></div>"
  );
}

const root = createRoot(rootElement);
root.render(<App />);
