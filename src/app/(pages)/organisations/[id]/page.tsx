"use client";

import { getOrganisationById } from "@/actions/global";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useQueryData } from "@/hooks/useQueryData";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function OrganisationProfile() {
  const { id } = useParams();
  const { data: organisation, isLoading } = useQueryData(
    ["organisation", id],
    () => getOrganisationById(id as string)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader state color="black" />
      </div>
    );
  }

  const { data: orgData, status } = organisation as {
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
        volunteers: number;
        claim: number;
      };
    };
  };

  if (status !== 200 || !orgData) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p>Organization not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 fixed top-0 w-full z-10 border-b">
        <div className="max-w-lg  flex items-center">
          <Link href="/organisations" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-semibold">Organisation</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto pt-20 px-4 pb-20">
        <div className="text-center mb-8">
          <Avatar className="h-20 w-20 mx-auto mb-4 bg-green-100">
            <AvatarImage src={orgData.imageUrl} alt={orgData.name} />
            <AvatarFallback className="bg-green-600 text-white text-2xl">
              {orgData.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mb-8">{orgData.name}</h2>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <p className="text-xl font-bold">{orgData._count.claim}+</p>
              <p className="text-sm text-gray-500">Total Campaigns</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{orgData._count.volunteers}+</p>
              <p className="text-sm text-gray-500">Total Volunteers</p>
            </div>
          </div>

          {/* Donate Button */}
          <Button
            className="w-full py-6 text-lg bg-orange-500 text-black hover:bg-orange-600 mb-8"
            asChild
          >
            <Link href={`/donate?org=${orgData.id}`}>Donate Now</Link>
          </Button>

          {/* Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="text-left mt-4">
              <p className="text-gray-600">{orgData.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-600">{orgData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-600">{orgData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-600">{orgData.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <p className="text-gray-600">{orgData.website}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="events" className="text-left mt-4">
              <p className="text-gray-600">No upcoming events</p>
            </TabsContent>
            <TabsContent value="reviews" className="text-left mt-4">
              <p className="text-gray-600">No reviews yet</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
