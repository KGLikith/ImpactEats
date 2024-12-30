"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";

const useSideBar = () => {
  const [expand, setExpand] = useState<boolean | undefined>(false);
  const router = useRouter();
  const pathname = usePathname();

  const page = pathname.split("/")[1];
  const { signOut } = useClerk();

  const onSignOut = () => signOut(() => router.push("/auth/sign-in"));

  const onExpand = () => {
    setExpand((prev) => !prev);
  };

  return {
    expand,
    onExpand,
    page,
    onSignOut,
  };
};

export default useSideBar;
