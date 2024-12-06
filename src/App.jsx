import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../src/componnets/Header";
import Hotel from "../src/componnets/Hotel";
import HotelDetailView from "../src/componnets/HotelDetailView"; // Import the detailed view component
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./componnets/Footer";
import LoginPage from "./componnets/Login";
import { useState } from "react";
import ProtectedRoute from "./componnets/ProtectedRoute";
function App() {

  const [loggedIn, setloggedIn] = useState(localStorage.getItem("token") || false);
  return (
    <Router>
      <Header loggedIn={loggedIn} setloggedIn={setloggedIn}/>
      <Routes>
        {/* Home Route - Displays the list of hotels */}
        <Route path="/login" element={<LoginPage setloggedIn={setloggedIn}/>}/>
        <Route path="/" element={<Hotel loggedIn={loggedIn}/>} />
        {/* Hotel Detail View Route */}
        <Route path="/hotel/:id" element={<ProtectedRoute element={<HotelDetailView />} loggedIn={loggedIn} />} />
        <Route path="/footer" element={<Footer />} />
      </Routes>
    </Router>
  );
}

export default App;

