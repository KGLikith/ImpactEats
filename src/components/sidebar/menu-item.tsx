import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { JSX } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
  size: "max" | "min";
  label: string;
  icon: JSX.Element;
  path?: string;
  current?: string;
  onSignOut?(): void;
};

const MenuItem = ({ size, path, icon, label, current, onSignOut }: Props) => {
  // console.log(path, current)
  switch (size) {
    case "max":
      return (
        <Link
          onClick={onSignOut}
          className={cn(
            "flex items-center gap-2 px-1 py-2 rounded-lg my-1 hover:bg-zinc-50 ",
            !current
              ? "text-gray-500"
              : current === path
              ? "bg-white font-bold text-black"
              : "text-gray-500"
          )}
          href={path ? `/${path}` : "#"}
        >
          {icon} {label}
        </Link>
      );
    case "min":
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Link
              onClick={onSignOut}
              className={cn(
                !current
                  ? "text-gray-500"
                  : current == path
                  ? "bg-white font-bold text-black"
                  : "text-gray-500",
                "rounded-lg py-2 my-1"
              )}
              href={path ? `/${path}` : "#"}
            >
              {icon}
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-white text-base text-black border border-gray-200 shadow-lg rounded-md"
          >
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      );
    default:
      return null;
  }
};

export default MenuItem;
