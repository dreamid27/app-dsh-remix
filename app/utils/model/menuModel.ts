import { ReactElement } from "react";

export interface IMenuNav {
  label: string;
  path: string;
  icon: (props: any) => JSX.Element;
}
