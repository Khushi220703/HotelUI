import React from 'react'
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({element,loggedIn}) => {

    if(!loggedIn){
        return <Navigate to="/" />;
    }
  return element;
}

export default ProtectedRoute
