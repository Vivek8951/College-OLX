import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import Signup from "./components/signup";
import MyCollege from "./components/mycollege";
import Sell from "./components/sell";
import Show from "./components/show";
import EditItem from "./components/edit";
import AdminPanel from "./components/AdminPanel";

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/mycollege" element={<MyCollege/>} />
        <Route path="/sell" element={<Sell/>} />
        <Route path="/items/:id" element={<Show />} />
        <Route path="/edit/:id" element={<EditItem/>} />
        <Route path="/admin" element={<AdminPanel />} />
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