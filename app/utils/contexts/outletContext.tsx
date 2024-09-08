import { createContext, useContext } from "react";
import useOutlet from "../hooks/useOutlet";
import { IOutletProps } from "../model/outletModel";

type OutletProps = {
  children: React.ReactNode;
};

export const OutletContext = createContext<IOutletProps | null>(null);

export const OutletProvider = ({ children }: OutletProps) => {
  const obj = useOutlet();
  return (
    <OutletContext.Provider value={obj}>{children}</OutletContext.Provider>
  );
};

export const useOutletContext = () => {
  const outletCtx = useContext(OutletContext);
  if (!outletCtx) {
    throw new Error("Something error with authContext");
  }
  return outletCtx;
};
