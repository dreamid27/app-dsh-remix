import { IOutlet } from "./authModel";

export interface IOutletProps {
  isOpenDrawer: boolean;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  selectedOutlet: IOutlet | null;
  onSelectedOutlet: (outlet: IOutlet) => void;
  outletList: IOutlet[];
  isHasMultiOutlet: boolean;
}

export interface IIntegrationOutlet {
  name: string;
  integration_id: string;
  is_integrated: boolean;
  email: string;
  status: boolean;
}

export interface ICompanyIntegration {
  integrations: IIntegrationOutlet[];
}
