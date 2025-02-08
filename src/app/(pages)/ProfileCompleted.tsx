"use client";
import { useGetCurrentUserTypeInfo } from "@/hooks/user";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userType, isLoading } = useGetCurrentUserTypeInfo();
  const [user, setUser] = useState(userType);
  const pathname = usePathname();

  useEffect(() => {
    if (userType) {
      setUser(userType);
    }
  }, [userType]);

  if (isLoading) return <></>;

  const isProfileIncomplete = !user?.type;
  const isProfilePage = pathname === "/profile"; // Exclude profile page

  return (
    <div className="relative min-h-screen">
      {/* Profile Completion Message (Only when the profile is incomplete and not on profile page) */}
      {isProfileIncomplete && !isProfilePage && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-green-950 border border-gray-600 text-gray-200 p-6 rounded-lg shadow-lg max-w-lg text-center">
            <p className="font-semibold text-lg">
              Please update your profile to help us with your experience.
            </p>
            <Link
              href="/profile"
              className="mt-4 inline-block bg-gray-700 text-green-400 px-4 py-2 rounded-md font-bold hover:text-green-300 transition"
            >
              Complete Your Profile
            </Link>
          </div>
        </div>
      )}

      {/* Main Content: Apply blur when profile is incomplete and not on profile page */}
      <div
        className={`transition-all duration-300 ${
          isProfileIncomplete && !isProfilePage ? "blur-md pointer-events-none" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
