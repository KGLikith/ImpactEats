import { SIDE_BAR_MENU } from "@/constants/menu";

import React from "react";

import { LogOut, MoveRight } from "lucide-react";
import MenuItem from "./menu-item";

type MinMenuProps = {
  onShrink(): void;
  current: string;
  onSignOut(): void;
};

export const MinMenu = ({ onShrink, current, onSignOut }: MinMenuProps) => {
  return (
    <div className="p-3 flex flex-col items-center h-full">
      <span className="animate-fade-in opacity-0 delay-300 fill-mode-forwards cursor-pointer">
        <MoveRight onClick={onShrink} />
      </span>
      <div className="animate-fade-in opacity-0 delay-300 fill-mode-forwards flex flex-col justify-between h-full pt-10">
        <div className="flex flex-col gap-5">
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem size="min" {...menu} key={key} current={current} />
          ))}
        </div>

        <div className="flex flex-col mb-5">
          <MenuItem
            size="min"
            label="Sign out"
            icon={<LogOut />}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </div>
  );
};
