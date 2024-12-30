"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import MaxMenu from "./maximized-menu";
import { MinMenu } from "./minimized-menu";
import useSideBar from "@/context/use-sidebar";
import { TooltipProvider } from "../ui/tooltip";
import {  useGetUser } from "@/hooks/user";
import { UserTypeInfo } from "@/schemas/user.schema";

const SideBar = () => {
  const [currentuserType, setCurrentUserType] = useState<UserTypeInfo>();
  const { user } = useGetUser();
  const { expand, onExpand, page, onSignOut } = useSideBar();
  useEffect(() => {
    setCurrentUserType(user);
  });
  if (!currentuserType) return null;
  return (
    <div
      className={cn(
        "bg-cream dark:bg-neutral-950 h-screen w-[60px] fill-mode-forwards fixed md:relative",
        expand == undefined && "",
        expand == true
          ? "animate-open-sidebar"
          : expand == false && "animate-close-sidebar"
      )}
    >
      <TooltipProvider>
        {!expand ? (
          <MinMenu
            onShrink={onExpand}
            type={currentuserType.type}
            current={page!}
            onSignOut={onSignOut}
          />
        ) : (
          <MaxMenu
            current={page!}
            type={currentuserType.type}
            onExpand={onExpand}
            onSignOut={onSignOut}
          />
        )}
      </TooltipProvider>
    </div>
  );
};

export default SideBar;
