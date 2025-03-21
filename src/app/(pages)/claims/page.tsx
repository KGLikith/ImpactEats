"use client";
import Loader from "@/components/ui/loader";
import { useGetCurrentUserTypeInfo } from "@/hooks/user";
import { UserTypeInfo } from "@/schemas/user.schema";
import Link from "next/link";
import React, { useEffect } from "react";
import ClaimsList from "./_components/ClaimsList";


export default function ClaimsPage() {
  const [organisation, setOrganisation] = React.useState<UserTypeInfo>();
  const { userType, isLoading } = useGetCurrentUserTypeInfo();

  useEffect(() => {
    if (userType) setOrganisation(userType);
  }, [userType, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader state color="black" />
      </div>
    );
  }

  if (organisation?.type !== "Organisation") {
    return <div className="flex flex-col justify-center items-center h-full w-full bg-white">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        {"The page you're looking for does not exist or you don't have access."}
      </p>
      <Link
        href={"/dashboard"}
        className="px-6 py-3 bg-orange-500 text-blue-400 font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
      >
        Return to Dashboard
      </Link>
    </div>;
  }

  return <div className="h-full w-full">
    <ClaimsList userType={userType} />
  </div>;
}
