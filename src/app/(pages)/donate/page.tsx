"use client";
import React from "react";
import DonationForm from "./_components/donationform";
import { useGetCurrentUserTypeInfo } from "@/hooks/user";
import Loader from "@/components/ui/loader";
import { UserTypeInfo } from "@/schemas/user.schema";
import {
  useDonationContextHook,
} from "@/context/user-donation";
import DeliveryInfo from "./_components/deliveryinfo";

export default function Page() {
  const { currentStep, } = useDonationContextHook();
  const { userType, isLoading } = useGetCurrentUserTypeInfo();
  const [donor, setDonor] = React.useState<UserTypeInfo | null>(null);
  React.useEffect(() => {
    if (userType) {
      setDonor(userType);
    }
  }, [userType]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader state color="black" />
      </div>
    );
  }

  if (!donor) {
    return null;
  }
  switch (currentStep) {
    case 1:
      return (
        <div className=" py-4 px-4 sm:px-6 lg:px-4  ">
          <div className="flex flex-col gap-2 ">
            <h2 className="text-2xl font-extrabold">Donate</h2>
            <p className="text-base text-black/50">
              Donate to a cause you care about
            </p>
          </div>
          <div className=" gap-2 h-full mx-auto p-6 space-y-4 bg-white rounded-lg shadow-md">
            <DonationForm type="donation" userType={donor.type as "Donor" | "Volunteer" | "Organisation"} donor={donor} />
          </div>
        </div>
      );
    case 2:
      return (
        <div className=" py-4 px-4 sm:px-6 lg:px-4  ">
          <div className="flex flex-col gap-2 ">
            <h2 className="text-2xl font-extrabold">Donate</h2>
            <p className="text-base text-black/50">
              Donate to a cause you care about
            </p>
          </div>
          <div className=" gap-2 h-full mx-auto p-6 space-y-4 bg-white rounded-lg shadow-md">
            <DeliveryInfo />
          </div>
        </div>
      );
  }
}
