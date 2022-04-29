import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <React.StrictMode>
            <Routes>
                <Route exact path="/" element={<App />}></Route>
                <Route exact path="/dashboard" element={<Dashboard />}></Route>
            </Routes>
        </React.StrictMode>
    </BrowserRouter>
);

reportWebVitals();
