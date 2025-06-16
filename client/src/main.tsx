import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { LoadScript } from "@react-google-maps/api";


const libraries: ("places")[] = ["places"];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <App />
        <Toaster position="top-center" />
      </LoadScript>
    </BrowserRouter>
  </React.StrictMode>
);
