import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../services/UserContext";
import { toast } from "react-toastify";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useUser();

  useEffect(() => {
    if (!currentUser) {
      toast.warning("You need to login first!");
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
