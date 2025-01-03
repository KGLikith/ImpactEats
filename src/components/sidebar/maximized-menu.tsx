import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  DONOR_SIDE_BAR_MENU,
  ORGANISATION_SIDE_BAR_MENU,
  VOLUNTEER_SIDE_BAR_MENU,
} from "@/constants/menu";
import MenuItem from "./menu-item";
import { redirect } from "next/navigation";

type Props = {
  onExpand(): void;
  current: string;
  type: string;
  onSignOut(): void;
};

const MaxMenu = ({ current, onExpand, type, onSignOut }: Props) => {
  console.log(type);
  return (
    <div className="py-3 px-4 flex flex-col h-full border-r">
      <div className="flex justify-between items-center">
        <Image
          src="/images/logowhite.png"
          alt="LOGO"
          sizes="100vw"
          onClick={() => redirect("/")}
          className="animate-fade-in opacity-0 delay-300 fill-mode-forwards cursor-pointer"
          style={{
            width: "50%",
            height: "auto",
          }}
          width={0}
          height={0}
        />
        <Menu
          className="cursor-pointer animate-fade-in opacity-0 delay-300 fill-mode-forwards"
          onClick={onExpand}
        />
      </div>
      <div className="animate-fade-in opacity-0 delay-200 fill-mode-forwards flex flex-col justify-between h-full pt-10">
        <div className="flex flex-col">
          <p className="text-xs text-gray-500 mb-3">MENU</p>
          {type === "Donor" &&
            DONOR_SIDE_BAR_MENU.map((menu, key) => (
              <MenuItem size="max" {...menu} key={key} current={current} />
            ))}
          {type === "Volunteer" &&
            VOLUNTEER_SIDE_BAR_MENU.map((menu, key) => (
              <MenuItem size="max" {...menu} key={key} current={current} />
            ))}
          {type === "Organisation" &&
            ORGANISATION_SIDE_BAR_MENU.map((menu, key) => (
              <MenuItem size="max" {...menu} key={key} current={current} />
            ))}
        </div>
        <div className="flex flex-col mb-5">
          <p className="text-xs text-gray-500 mb-3">OPTIONS</p>
          <MenuItem
            size="max"
            label="Sign out"
            icon={<LogOut />}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </div>
  );
};

export default MaxMenu;
