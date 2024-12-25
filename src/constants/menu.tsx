import Donate from "@/components/icons/donate";
import { Building2, History, LayoutDashboardIcon, User } from "lucide-react";
import { JSX } from "react";

type SIDE_BAR_MENU_PROPS = {
  label: string;
  icon: JSX.Element;
  path: string;
};

export const SIDE_BAR_MENU: SIDE_BAR_MENU_PROPS[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
    path: "dashboard",
  },
  {
    label: "Donate",
    icon: <Donate />,
    path: "donate",
  },
  {
    label: "History",
    icon: <History />,
    path: "history",
  },
  {
    label: "Organisations",
    icon: <Building2 />,
    path: "organisations",
  },
  {
    label: "Profile",
    icon: <User />,
    path: "profile",
  },
];

