import React, { useState } from 'react';
import { LoginForm, SignupForm } from './Forms';

const LoginPage = ({ isLogin, closeModal, handleModalSwitch,  setloggedIn }) => {
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {isLogin ? (
          <LoginForm   setloggedIn={setloggedIn} closeModal = {closeModal}/>
        ) : (
          <SignupForm setloggedIn={setloggedIn} closeModal = {closeModal}/>
        )}
        <button onClick={handleModalSwitch} style={modalStyles.switchButton}>
          {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Login'}
        </button>
        <button onClick={closeModal} style={modalStyles.closeButton}>Close</button>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '40%',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  submitButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#FF5A5F',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft:"10px"
  },
  switchButton: {
    padding: '5px 10px',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
    cursor: 'pointer',
    marginLeft:"10px"

  },
  closeButton: {
    padding: '5px 10px',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
    cursor: 'pointer',
     marginLeft:"10px"
  },
};

export default LoginPage;
