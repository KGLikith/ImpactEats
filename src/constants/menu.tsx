"use client";
import Delivery from "@/components/icons/delivery";
import Donate from "@/components/icons/donate";
import TakeAway from "@/components/icons/take";
import {
  Bell,
  Building2,
  History,
  LayoutDashboardIcon,
  User,
  Users,
} from "lucide-react";
import { JSX } from "react";

type SIDE_BAR_MENU_PROPS = {
  label: string;
  icon: JSX.Element;
  path: string;
};

export const BOTTOM_SIDE_BAR_MENU: SIDE_BAR_MENU_PROPS[] = [
  {
    label: "Organisations",
    icon: <Building2 />,
    path: "organisations",
  },
  {
    label: "History",
    icon: <History />,
    path: "history",
  },
  {
    label: "Notifications",
    icon: <Bell />,
    path: "notifications",
  },
  {
    label: "Profile",
    icon: <User />,
    path: "profile",
  },
];

export const DONOR_SIDE_BAR_MENU: SIDE_BAR_MENU_PROPS[] = [
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

  ...BOTTOM_SIDE_BAR_MENU,
];

export const VOLUNTEER_SIDE_BAR_MENU: SIDE_BAR_MENU_PROPS[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
    path: "dashboard",
  },
  {
    label: "Volunteer",
    icon: <Delivery />,
    path: "volunteer",
  },
  ...BOTTOM_SIDE_BAR_MENU,
];

export const ORGANISATION_SIDE_BAR_MENU: SIDE_BAR_MENU_PROPS[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
    path: "dashboard",
  },
  {
    label: "Donations",
    icon: <Donate />,
    path: "donations",
  },
  {
    label: "Claims",
    icon: <TakeAway />,
    path: "claims",
  },
  {
    label: "Your Volunteers",
    icon: <Users />,
    path: "volunteers",
  },
  ...BOTTOM_SIDE_BAR_MENU,
];
