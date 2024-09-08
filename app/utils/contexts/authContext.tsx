import { createContext, useContext } from "react";
import useAuth from "../hooks/useAuth";
import { IAuthProps } from "../model/authModel";

type AuthProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<IAuthProps | null>(null);

export const AuthProvider = ({ children }: AuthProps) => {
  const obj = useAuth();

  return <AuthContext.Provider value={obj}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const authCtx = useContext(AuthContext);
  if (!authCtx) {
    throw new Error("Something error with authContext");
  }
  return authCtx;
};
