'use client'
import React, { useEffect } from "react";
import DonationPage from "./_components/DonationPage";
import { useParams } from "next/navigation";
import { useGetCurrentUserTypeInfo } from "@/hooks/user";
import Loader from "@/components/ui/loader";

export default function Page() {
  const { id } = useParams();
  const { userType, isLoading } = useGetCurrentUserTypeInfo();
  const [user, setUser] = React.useState(userType);
  useEffect(() => {
    if (userType) {
      setUser(userType);
    }
  }, [userType]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader state color="black" />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <DonationPage donationId={id as string} userType={user} />
    </div>
  );
}
