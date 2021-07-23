import React, { useEffect, useState } from "react";
import app from "./firebase";
import firebase from "firebase/app";

export interface AuthState {
  user: firebase.User | null;
  userRole?: "admin" | "vendor" | "shipper";
  idToken: string | null | undefined;
}

export const AuthContext = React.createContext<AuthState>({
  user: null,
  idToken: undefined,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [authState, setAuthstate] = useState<AuthState>({
    user: null,
    idToken: null,
  });
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const unsubscribe = app.auth().onAuthStateChanged(async (user) => {
      const idToken = await user?.getIdToken(true); // true in the parameter value to force token refresh
      const idTokenResult = await user?.getIdTokenResult();
      const userRole = idTokenResult?.claims.apiClaims["X-Hasura-Role"];
      setAuthstate({ user, idToken, userRole });
      setPending(false);
    });
    return () => unsubscribe();
  }, []);

  // TODO:  add a good looking loader here
  if (pending) {
    return <section></section>;
  }

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};
