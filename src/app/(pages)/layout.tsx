import SideBar from "@/components/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await currentUser();
  if (!authenticated) return null;
  return (
    <>
      <div className="flex h-screen w-full">
        <SideBar />
        <div className="w-full h-screen flex flex-col pl-20 md:pl-4 overflow-y-auto no-scrollbar  ">
          {children}
        </div>
      </div>
    </>
  );
}
