'use client'
import Loader from "@/components/ui/loader";
import { useGetCurrentUserTypeInfo } from "@/hooks/user";
import Link from "next/link";
import React from "react";
import DonationsAndOrganizationsPage from "./VolunteerPage";

export default function Page() {
  const { userType, isLoading } = useGetCurrentUserTypeInfo();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader state color="black"></Loader>
      </div>
    );
  }
  if (userType?.type !== "Volunteer") {
    return (
      <div className="flex flex-col justify-center items-center h-full w-full bg-white">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {
            "The page you're looking for does not exist or you don't have access."
          }
        </p>
        <Link
          href={"/dashboard"}
          className="px-6 py-3 bg-orange-500 text-blue-400 font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <DonationsAndOrganizationsPage userType={userType} />
    </div>
  );
}
