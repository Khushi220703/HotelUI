import React, { useState } from 'react';
import Logo from "../assets/hotelLogos.jpg";
import SearchBar from "./SearchBar";
import LoginPage from './Login'
import { useNavigate } from 'react-router-dom';

const HomePage = ({ setloggedIn,loggedIn}) => {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // To toggle between Login and Signup forms

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();
  const handleModalSwitch = () => {
    setIsLogin(!isLogin); // Toggle between login and signup forms
  };

  const handleLogout = () => {
    
    localStorage.removeItem('token');  
    setloggedIn(false);
    window.location.href = '/'; 
   
  };
  

  return (
    <>
      <div className="header" style={style.headerContainer}>
        <div className="logo">
          <img src={Logo} alt='airbnb logo' width={100} height={100} onClick={()=>navigate("/")} style={{cursor:"pointer"}}/>
        </div>
        {/* <SearchBar /> */}
        
        {!loggedIn ?<div className="auth-buttons">
          <button onClick={openModal} style={style.authButton}>Login / Sign Up</button>
        </div>: <div className="logout-button">
          <button onClick={handleLogout} style={style.authButton}>Logout</button>
        </div>}
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <LoginPage
          isLogin={isLogin}
          closeModal={closeModal}
          handleModalSwitch={handleModalSwitch}
          setloggedIn={setloggedIn}
        />
      )}
    </>
  );
};

const style = {
  headerContainer: {
    borderBottom: "1px solid gray",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authButton: {
    padding: "10px 20px",
    backgroundColor: "#FF5A5F",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }
};

export default HomePage;
