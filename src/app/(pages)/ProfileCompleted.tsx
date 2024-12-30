"use client";
import { useGetCurrentUserTypeInfo } from "@/hooks/user";
import Link from "next/link";
import React from "react";

export default function ProfileCompletedPage() {
  const { userType, isLoading } = useGetCurrentUserTypeInfo();

  if (isLoading) return <></>;

  if(!userType) return <></>;
  return (
    <>
      {!isLoading && Object?.keys(userType) && Object?.keys(userType).length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md">
          <p className="font-semibold text-lg">
            Please complete your profile to continue with the application.
            <Link
              href={"/profile"}
              className="text-blue-500 font-bold underline ml-1"
            >
              Complete your profile
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
