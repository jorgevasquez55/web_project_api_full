import React from "react";
import { Route, Navigate } from "react-router-dom";

function ProtectedRoute({ token, main }) {
  return token ? main : <Navigate to={"/signin"} />;   
}

export default ProtectedRoute;
