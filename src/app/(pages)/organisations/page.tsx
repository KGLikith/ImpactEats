"use client";
import { getAllOrganisations } from "@/actions/global";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useQueryData } from "@/hooks/useQueryData";
import { MapPin, Phone, User, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type OrganisationType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  _count: {
    volunteers: number;
    claims: number;
  };
};

export default function Organisations() {
  const router = useRouter();
  const { data: organisations, isLoading } = useQueryData(
    ["all-organisations"],
    getAllOrganisations
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100/50 z-50">
        <Loader state color="black" />
      </div>
    );
  }

  const { data: organisationsData, status } = organisations as {
    status: number;
    data: OrganisationType[];
  };

  if (status !== 200 || organisationsData.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto" />
          <h1 className="text-2xl font-semibold text-gray-700 mt-4">
            No Organizations Found
          </h1>
          <p className="text-gray-500 mt-2">
            We're sorry, but we couldn't find any organizations. Please try
            again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Organizations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organisationsData.map((org) => (
          <div
            key={org.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full gap-4"
          >
            {/* Wrap only the parts linking to details page */}
            <Link href={`/organisations/${org.id}`}>
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={org.imageUrl} alt={org.name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {org.name}
                </h2>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {org.description}
              </p>
            </Link>

            {/* Separate interactive elements */}
            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                {org.address}
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                {org.phone}
              </div>
              {org.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-gray-400" />
                  <Button
                    onClick={() => router.push(org.website)}
                    variant="link"
                    className="p-0 m-0"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>Volunteers: {org._count.volunteers}</span>
              <span>Claims: {org._count.claims}</span>
            </div>

            <Button
              className="mt-4 bg-green-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/donate/${org.id}`);
              }}
            >
              Donate Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
