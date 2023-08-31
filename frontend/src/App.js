import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AppBar, Toolbar, Typography } from '@mui/material';
// import axios from "axios";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
// import Contact from "./components/Contact";
import Feedback from "./components/Feedback";
import { Download } from "@mui/icons-material";
import Status from "./components/Status";

function App() {
  // const [email, setEmail] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Feedback />} />
        <Route path="/download" element={<Download />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
