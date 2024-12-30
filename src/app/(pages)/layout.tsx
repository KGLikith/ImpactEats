import { onLoginUser } from "@/actions/auth";
import SideBar from "@/components/sidebar";
import React from "react";
import ProfileCompletedPage from "./ProfileCompleted";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await onLoginUser();
  if (!authenticated) {
    return null;
  }
  if (!authenticated?.user) {
    return null;
  }
  return (
    <>
      <div className="flex h-screen w-full mb-20">
        <SideBar />
        <div className="w-full h-screen flex flex-col pl-20 md:pl-4  overflow-y-auto no-scrollbar ">
          <ProfileCompletedPage />
          {children}
        </div>
      </div>
    </>
  );
}
