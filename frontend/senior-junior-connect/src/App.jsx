import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import Signup from "./components/signup";
import MyCollege from "./components/mycollege";
import Sell from "./components/sell";
import Show from "./components/show";
import EditItem from "./components/edit";



function AppContent() {
  

  return (
    <>
      
     

        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/mycollege" element={<MyCollege/>}></Route>
        <Route path="/sell" element={<Sell/>}></Route>
        <Route path="/items/:id" element={<Show />} />
        <Route path="/edit/:id" element={<EditItem/>} />

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
