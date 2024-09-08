import { IMenuNav } from "../model/menuModel";
import {
  CheckCircle,
  Checks,
  File,
  House,
  UploadSimple,
  User,
} from "phosphor-react";

export const menuIndexing = ["", "insight", "upload", "me"];

export const menuListObj: IMenuNav[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: (props: any) => <House {...props} />,
  },
  {
    label: "Task",
    path: "/todo",
    icon: (props: any) => <Checks {...props} />,
  },
  {
    label: "Upload",
    path: "/upload",
    icon: (props: any) => <UploadSimple {...props} />,
  },
  {
    label: "Laporan",
    path: "/report",
    icon: (props: any) => <File {...props} />,
  },
  {
    label: "Profile",
    path: "/me",
    icon: (props: any) => <User {...props} />,
  },
];

export const menuListObjV2: IMenuNav[] = [
  {
    label: "Home",
    path: "/",
    icon: (props: any) => <House {...props} />,
  },
  {
    label: "Upload",
    path: "/upload",
    icon: (props: any) => <UploadSimple {...props} />,
  },
  {
    label: "Task",
    path: "/todo",
    icon: (props: any) => <CheckCircle {...props} />,
  },
];
