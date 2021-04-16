import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "../Auth";


interface Props{
  role: string;
}

const PrivateRoute:React.FC<Props> = ({ role, children, ...props }) => {
  const { currentUser } = useContext(AuthContext);
  if (currentUser){
    return (
      <Route 
        {...props}
      >
        {children}
      </Route>
    )
  }
  return <Navigate to="/login"/>
  
};

export default PrivateRoute;
