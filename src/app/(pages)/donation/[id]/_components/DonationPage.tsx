"use client";

import { getDonationDetails } from "@/actions/donation";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useQueryData } from "@/hooks/useQueryData";
import { DonationType } from "@/schemas/donation-form.schema";
import Link from "next/link";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  PackageIcon,
  InfoIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

type Props = {
  donationId: string;
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
    status: string;
    organisationId: string;
    createdAt: string;
    organisation: {
      id: string;
      name: string;
      imageUrl?: string;
      email: string;
      phone: string;
      address: string;
    };
    task?: {
      id: string;
      status: string;
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

export default function DonationPage({ donationId }: Props) {
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
      <div className="flex justify-center items-center h-full w-full">
        <Loader state color="black" />
      </div>
    );

  if (!donationData)
    return (
      <div className="flex flex-col justify-center items-center h-full w-full">
        <div>Page not found...</div>
        <p>
          Return to home...{" "}
          <Link className="text-blue-500" href={"/dashboard"}>
            click here
          </Link>
        </p>
      </div>
    );
  console.log(donationData);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-6xl mx-auto shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Donation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Donation Information */}
          <div className="p-6 rounded-lg bg-white border shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Donation Information
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <p className="text-gray-700">
                  <strong className="text-gray-800">Food Name:</strong>{" "}
                  {donationData.name}
                </p>
                <p className="text-gray-700">
                  <PackageIcon className="inline-block mr-2 h-5 w-5 text-gray-600" />
                  <strong className="text-gray-800">Type:</strong>{" "}
                  {donationData.foodType}
                </p>
                <p className="text-gray-700">
                  <InfoIcon className="inline-block mr-2 h-5 w-5 text-gray-600" />
                  <strong className="text-gray-800">Quantity:</strong>
                  {donationData.quantityUnit === "WEIGHT" ? (
                    <>{donationData.quantity} KG </>
                  ) : (
                    <>Feeds {donationData.quantity} People</>
                  )}
                </p>
                <p className="text-gray-700">
                  <CalendarIcon className="inline-block mr-2 h-5 w-5 text-gray-600" />
                  <strong className="text-gray-800">Available Date:</strong>{" "}
                  {new Date(donationData.availableDate).toLocaleDateString()} at{" "}
                  {donationData.availableTime}
                </p>
                <p className="text-gray-700">
                  <CalendarIcon className="inline-block mr-2 h-5 w-5 text-gray-600" />
                  <strong className="text-gray-800">Expiry Date:</strong>{" "}
                  {new Date(donationData.expiryDate).toLocaleDateString()} at{" "}
                  {donationData.expiryTime}
                </p>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <p className="text-gray-700">
                  <MapPinIcon className="inline-block mr-2 h-5 w-5 text-gray-600" />
                  <strong className="text-gray-800">Pickup Address:</strong>{" "}
                  {donationData.address}
                </p>
                {donationData.additionalDeliveryNote && (
                  <p className="text-gray-700">
                    <strong className="text-gray-800">Delivery Note:</strong>{" "}
                    {donationData.additionalDeliveryNote}
                  </p>
                )}
                <p className="text-gray-700">
                  <strong className="text-gray-800">Delivery Option:</strong>{" "}
                  {donationData.deliveryType}
                </p>
                {donationData.description && (
                  <p className="text-gray-700">
                    <strong className="text-gray-800">Description:</strong>{" "}
                    {donationData.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-white border shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <p className="text-gray-700">
                <strong className="text-gray-800">Email:</strong>{" "}
                {donationData.email}
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-800">Phone:</strong>{" "}
                {donationData.phone}
              </p>
            </div>
          </div>

          {/* Food Image */}
          {donationData.imageUrl && (
            <div className="p-6 rounded-lg bg-white border shadow-sm flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Food Image
              </h2>
              <div className="w-[400px] h-auto">
                <Image
                  src={donationData.imageUrl}
                  alt="Food Donation"
                  className="rounded-lg border max-w-full h-auto"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          )}

          <Separator />
          {/* Donor Information */}
          <div className="p-4 rounded-lg bg-white border">
            <h2 className="text-lg font-medium text-gray-700">
              Donor Information
            </h2>
            <div className="flex items-center space-x-4 mt-4">
              <Avatar className="h-16 w-16">
                {donationData.donor.imageUrl ? (
                  <AvatarImage
                    src={donationData.donor.imageUrl}
                    alt={donationData.donor.name}
                  />
                ) : (
                  <AvatarFallback>
                    {donationData.donor.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <Link
                  href={`/donors/${donationData.donor.id}`}
                  className="text-gray-900 font-semibold hover:underline"
                >
                  {donationData.donor.name}
                </Link>
                <p className="text-gray-600">
                  <MailIcon className="inline-block mr-2 h-4 w-4" />
                  {donationData.donor.email}
                </p>
                <p className="text-gray-600">
                  <PhoneIcon className="inline-block mr-2 h-4 w-4" />
                  {donationData.donor.phone}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Claim Information */}
          <div className="p-4 rounded-lg bg-white border">
            <h2 className="text-lg font-medium text-gray-700">
              Claim Information
            </h2>
            <div className="flex items-center space-x-4 mt-4">
              {donationData.claim ? (
                <>
                  <Avatar className="h-16 w-16">
                    {donationData.claim.organisation.imageUrl ? (
                      <AvatarImage
                        src={donationData.claim.organisation.imageUrl}
                        alt={donationData.claim.organisation.name}
                      />
                    ) : (
                      <AvatarFallback>
                        {donationData.claim.organisation.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <Link
                      href={`/organisations/${donationData.claim.organisationId}`}
                      className="text-gray-900 font-semibold hover:underline"
                    >
                      {donationData.claim.organisation.name}
                    </Link>
                    <p className="text-gray-600">
                      <MailIcon className="inline-block mr-2 h-4 w-4" />
                      {donationData.claim.organisation.email}
                    </p>
                    <p className="text-gray-600">
                      <PhoneIcon className="inline-block mr-2 h-4 w-4" />
                      {donationData.claim.organisation.phone}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Badge color="red" variant={"destructive"}>
                    Not Claimed
                  </Badge>
                </>
              )}
            </div>
          </div>

          <Separator />
          {/* Task Information */}
          <div className="p-4 rounded-lg bg-white border">
            <h2 className="text-lg font-medium text-gray-700">
              Volunteer Task Information
            </h2>
            <div className="flex items-center space-x-4 mt-4">
              {donationData.claim?.task ? (
                <>
                  <Avatar className="h-16 w-16">
                    {donationData.claim.task.volunteer.imageUrl ? (
                      <AvatarImage
                        src={donationData.claim.task.volunteer.imageUrl}
                        alt={donationData.claim.task.volunteer.name}
                      />
                    ) : (
                      <AvatarFallback>
                        {donationData.claim.task.volunteer?.name?.charAt(0) ||
                          "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <Link
                      href={`/volunteers/${donationData.claim.task.volunteerId}`}
                      className="text-gray-900 font-semibold hover:underline"
                    >
                      {donationData.claim.task.volunteer.name}
                    </Link>
                    <>
                      <p className="text-gray-600">
                        <MailIcon className="inline-block mr-2 h-4 w-4" />
                        {donationData.claim.task.volunteer.email}
                      </p>
                      <p className="text-gray-600">
                        <PhoneIcon className="inline-block mr-2 h-4 w-4" />
                        {donationData.claim.task.volunteer.phone}
                      </p>
                    </>
                  </div>
                </>
              ) : (
                <>
                  <Badge color="red" variant={"destructive"}>
                    Not Assigned
                  </Badge>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
