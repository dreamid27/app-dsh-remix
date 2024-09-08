import { Dispatch, SetStateAction } from "react";
import { IToDoOutlet } from "services/company";
import { IOutlet } from "./authModel";
import { IIntegrationOutlet } from "./companyIntegrationModel";

export interface IOutletProps {
  isFetched: boolean;
  isLoading: boolean;
  isOpenDrawer: boolean;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  selectedOutlet: IOutlet | null;
  onSelectedOutlet: (outlet: IOutlet) => void;
  onFetchCompanyData: () => void;
  outletList: IOutlet[];
  isHasMultiOutlet: boolean;
  integrations: IIntegrationOutlet[];
  toDo: IToDoOutlet | null;
}
