import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { updateViewportHeight } from "./setVh";

updateViewportHeight();
window.addEventListener("resize", updateViewportHeight);

createRoot(document.getElementById("root")).render(<App />);
