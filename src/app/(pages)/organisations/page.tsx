"use client";
import {
  getAllOrganisations,
  getUserTypeWithVolunteers,
} from "@/actions/global";
import { addVolunteer } from "@/actions/organisations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { useMutationData } from "@/hooks/useMutationData";
import { useQueryData } from "@/hooks/useQueryData";
import { UserTypeInfo } from "@/schemas/user.schema";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, Phone, User, Globe, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

type userType = UserTypeInfo & {
  organisations?: {
    id: string;
  }[];
};

export default function Organisations() {
  const { data, isLoading: userLoading } = useQueryData(
    ["user-type"],
    getUserTypeWithVolunteers
  );
  const [userType, setUserType] = useState<userType>();
  const router = useRouter();
  const { data: organisations, isLoading } = useQueryData(
    ["all-organisations"],
    getAllOrganisations
  );
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showVolunteerOnly, setShowVolunteerOnly] = useState(false);

  const { mutate } = useMutationData(
    ["add-volunteer"],
    ({ orgId, volId }: { orgId: string; volId: string }) =>
      addVolunteer(orgId, volId),
    "all-organisations",
    async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["user-type"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["organisation", data.id],
      });
      toast({
        title: "Volunteered",
        description: "You have successfully volunteered for the organization.",
        duration: 3000,
      });
    }
  );

  useEffect(() => {
    if (data) {
      const { data: userType } = data as { data: userType };
      setUserType(userType);
    }
  });
  if (isLoading || userLoading) {
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
            {
              "We're sorry, but we couldn't find any organizations. Please try again later."
            }
          </p>
        </div>
      </div>
    );
  }

  const filteredOrganisations = organisationsData.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVolunteerFilter =
      !showVolunteerOnly ||
      userType?.organisations?.find((o) => o.id === org.id);

    return matchesSearch && matchesVolunteerFilter;
  });

  return (
    <div className="px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Organizations</h1>
      <div className="flex flex-col  gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search by name, email, or address"
          className="flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {userType?.type === "Volunteer" && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="volunteerFilter"
              checked={showVolunteerOnly}
              onChange={(e) => setShowVolunteerOnly(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="volunteerFilter" className="text-gray-700">
              Show the organizations you volunteer only
            </label>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredOrganisations.map((org) => (
          <div
            key={org.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full gap-4"
          >
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
            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                {org.address}
              </div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(org.phone);
                  toast({
                    title: "Phone Copied",
                    description:
                      "The phone number has been copied to clipboard.",
                    duration: 3000,
                  });
                }}
              >
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                {org.phone}
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <a
                  href={`mailto:${org.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {org.email}
                </a>
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
            <div className="flex flex-col justify-between">

            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>Volunteers: {org._count.volunteers}</span>
              <span>Claims: {org._count.claims}</span>
            </div>
            {userType?.type === "Volunteer" && (
              <>
                {userType?.organisations?.find((orgd) => orgd.id === org.id) ? (
                  <Button
                    className="mt-4 bg-green-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        title: "Already Volunteered",
                        description:
                          "You have already volunteered for the organization.",
                        duration: 3000,
                      });
                    }}
                  >
                    You volunteer for this organisation
                  </Button>
                ) : (
                  <Button
                    className="mt-4 bg-green-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      mutate({ orgId: org.id, volId: userType.id });
                    }}
                  >
                    Volunteer
                  </Button>
                )}
              </>
            )}
            {userType?.type === "Donor" && (
              <Button
                className="mt-4 bg-green-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/donate/${org.id}`);
                }}
              >
                Donate Now
              </Button>
            )}
            </div>
          </div>
        ))}
        {filteredOrganisations.length === 0 && (
          <p className="text-center text-gray-500 w-full">
            No organizations match your search criteria.
          </p>
        )}
      </div>
    </div>
  );
}
