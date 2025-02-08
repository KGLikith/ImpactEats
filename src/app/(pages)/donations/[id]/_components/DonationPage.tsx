"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getDonationDetails,
} from "@/actions/donation";
import { useQueryData } from "@/hooks/useQueryData";
import { DonationType } from "@/schemas/donation-form.schema";
import { UserTypeInfo } from "@/schemas/user.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/ui/loader";
import {
  CalendarIcon,
  MapPinIcon,
  PackageIcon,
  InfoIcon,
} from "lucide-react";
import ClaimInfo from "./ClaimInfo";
import DonorInfo from "./DonorInfo";
import VolunteerInfo from "./VolunteerInfo";

type Props = {
  donationId: string;
  userType: UserTypeInfo;
};

type DonationPageType = DonationType & {
  donor: {
    id: string;
    name: string;
    phone: string;
    email: string;
    imageUrl?: string;
  };
  claim?: {
    id: string;
    status: "CLAIMED"  |  "ASSIGNED"  |  "RECIEVED"  |  "CANCELLED" ;
    organisationId: string;
    createdAt: string;
    organisation: {
      id: string;
      name: string;
      imageUrl?: string;
      email: string;
      phone: string;
      address: string;
      volunteers: {
        id: string;
      }[];
    };
    task?: {
      id: string;
      status: "PENDING" | "RECIEVED" | "CANCELLED" | "COMPLETED";
      volunteerId: string;
      volunteer: {
        id: string;
        name: string;
        imageUrl?: string;
        email: string;
        phone: string;
      };
      createdAt: string;
      updateAt: string;
    };
  };
};

export default function DonationPage({ donationId, userType }: Props) {
  const [donationData, setDonationData] =
    React.useState<DonationPageType | null>(null);
  const { data, isLoading } = useQueryData(["donation", donationId], () =>
     getDonationDetails(donationId)
  );

  useEffect(() => {
    if (data) {
      const { data: donation } = data as {
        data: DonationPageType;
      };
      setDonationData(donation);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gray-100">
        <Loader state color="blue" />
      </div>
    );

  if (!donationData)
    return (
      <div className="flex flex-col justify-center items-center h-full w-full bg-gray-100">
        <div className="text-2xl md:text-3xl font-bold text-red-600">Page not found...</div>
        <p className="mt-2 text-lg md:text-xl">
          Return to home{" "}
          <Link
            className="text-blue-600 font-semibold hover:underline"
            href="/dashboard"
          >
            click here
          </Link>
        </p>
      </div>
    );

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <Card className="w-full max-w-6xl mx-auto shadow-xl border border-gray-300 rounded-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-t-lg">
          <CardTitle className="text-2xl md:text-3xl font-bold">Donation Details</CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-white rounded-b-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-8">
              <div className="p-6 rounded-lg bg-gray-50 shadow-lg">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                  Donation Information
                </h2>
                <div className="space-y-2 text-sm md:text-base">
                  <p>
                    <strong>Food Name:</strong> {donationData.name}
                  </p>
                  <p>
                    <PackageIcon className="inline-block mr-2 h-5 w-5 text-blue-500" />
                    <strong>Type:</strong> {donationData.foodType}
                  </p>
                  <p>
                    <InfoIcon className="inline-block mr-2 h-5 w-5 text-blue-500" />
                    <strong>Quantity:</strong>{" "}
                    {donationData.quantityUnit === "WEIGHT"
                      ? `${donationData.quantity} KG`
                      : `Feeds ${donationData.quantity} People`}
                  </p>
                  <p>
                    <CalendarIcon className="inline-block mr-2 h-5 w-5 text-blue-500" />
                    <strong>Available Date:</strong>{" "}
                    {new Date(donationData.availableDate).toLocaleDateString()}
                  </p>
                  <p>
                    <MapPinIcon className="inline-block mr-2 h-5 w-5 text-blue-500" />
                    <strong>Pickup Address:</strong> {donationData.address}
                  </p>
                </div>
              </div>
              {donationData.imageUrl && (
                <div className="p-6 rounded-lg bg-gray-50 shadow-lg text-center">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                    Food Image
                  </h2>
                  <Image
                    src={donationData.imageUrl}
                    alt="Food Donation"
                    className="rounded-lg"
                    width={400}
                    height={400}
                  />
                </div>
              )}
              {/* Donor Information */}
              <DonorInfo donor={donationData.donor} />
            </div>

            {/* Right column */}
            <div className="space-y-8">
              {/* Claim Information */}
              <ClaimInfo
                donationId={donationData.id as string}
                claim={donationData.claim}
                userType={userType}
              />

              {/* Volunteer Task Information */}
              <VolunteerInfo
                donationId={donationData.id as string}
                claimId={donationData.claim?.id}
                task={donationData.claim?.task}
                userType={userType}
              />
            </div>
          </div>
          <Separator className="my-6" />
          <Link
            href="/dashboard"
            className="flex items-center justify-center p-3 text-sm md:text-base font-bold text-blue-600 hover:underline"
          >
            &larr; Back to Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
