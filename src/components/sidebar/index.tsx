"use client";
import { cn } from "@/lib/utils";
import React from "react";
import MaxMenu from "./maximized-menu";
import { MinMenu } from "./minimized-menu";
import useSideBar from "@/context/use-sidebar";
import { TooltipProvider } from "../ui/tooltip";

const SideBar = () => {
  const { expand, onExpand, page, onSignOut } = useSideBar();
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
          <MinMenu onShrink={onExpand} current={page!} onSignOut={onSignOut} />
        ) : (
          <MaxMenu current={page!} onExpand={onExpand} onSignOut={onSignOut} />
        )}
      </TooltipProvider>
    </div>
  );
};

export default SideBar;
