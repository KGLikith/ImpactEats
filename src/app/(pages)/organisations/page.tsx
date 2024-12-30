"use client";
import { getAllOrganisations } from "@/actions/global";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "@/components/ui/loader";
import { useQueryData } from "@/hooks/useQueryData";
import { MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Organisations() {
  const { data: organisations, isLoading } = useQueryData(
    ["all-organisations"],
    getAllOrganisations
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader state color="black" />
      </div>
    );
  }

  const { data: organisationsData, status } = organisations as {
    status: number;
    data: {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      website: string;
      imageUrl: string;
      description: string;
      _count: {
        donations: number;
        volunteers: number;
        claims: number;
      };
    }[];
  };

  if (status !== 200) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p>No organizations found</p>
      </div>
    );
  }

  if (organisationsData.length === 0) {
    return (
      <div className="  px-4 py-8 h-screen">
        <h1 className="text-3xl font-bold mb-6">Organizations</h1>
        <p className="h-full w-full flex justify-center items-center">No organizations found</p>
      </div>
    );
  }

  return (
    <div className=" px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Organizations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organisationsData.map((org) => (
          <div
            key={org.id}
            className="border-2 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full gap-2"
          >
            <Link
              href={`/organisations/${org.id}`}
              className="flex flex-col flex-grow"
            >
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={org.imageUrl} alt={org.name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{org.name}</h2>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">{org.description}</p>
              <div className="text-sm text-gray-500 space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {org.address}
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {org.phone}
                </div>
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Donations: {org._count.donations}</span>
                <span>Volunteers: {org._count.volunteers}</span>
                <span>Claims: {org._count.claims}</span>
              </div>
            </Link>
            {/* <Button
              className="w-full py-6 text-lg bg-orange-500 text-black hover:bg-orange-600 mt-4"
              onClick={(e) => handleDonateClick(e, org.id)}
            >
              Donate Now
            </Button> */}
          </div>
        ))}
      </div>
    </div>
  );
}
