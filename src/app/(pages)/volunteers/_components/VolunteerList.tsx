'use client';

import { getVolunteers } from "@/actions/organisations";
import Loader from "@/components/ui/loader";
import { useQueryData } from "@/hooks/useQueryData";
import { UserTypeInfo, volunteerType } from "@/schemas/user.schema";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MapPin } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

type Props = {
  organisation: UserTypeInfo;
};

type VolunteerListType = {
  volunteers: volunteerType[];
};

export default function VolunteerList({ organisation }: Props) {
  const [volunteers, setVolunteers] = useState<volunteerType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { data, isLoading } = useQueryData(
    ["volunteers", organisation.id],
    () => getVolunteers(organisation.id)
  );

  useEffect(() => {
    if (data) {
      const { volunteers } = data as VolunteerListType;
      if (Array.isArray(volunteers)) {
        setVolunteers(volunteers);
        setError(null);
      } else {
        setError("Invalid data format received for volunteers");
        setVolunteers([]);
      }
    }
  }, [data]);

  const handleCopyPhone = (phone: string) => {
    toast({
      title: "Phone copied",
      description: "Phone number copied to clipboard",
      duration: 2000,
    })
    navigator.clipboard.writeText(phone);
    console.log("Phone copied", phone);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader state color="black" />
      </div>
    );
  }

  const filteredVolunteers = volunteers?.filter((volunteer) =>
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Volunteer List</h2>
      <Input
        type="text"
        placeholder="Search by name or email"
        className="mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVolunteers.map((volunteer) => (
          <Card
            key={volunteer.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="pb-0">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={volunteer.imageUrl || '/placeholder.svg?height=64&width=64'}
                    alt={`${volunteer.name}'s avatar`}
                  />
                  <AvatarFallback>{volunteer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-semibold">{volunteer.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${volunteer.email}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {volunteer.email}
                </a>
              </div>
              <div
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => handleCopyPhone(volunteer.phone)}
              >
                <Phone className="h-4 w-4 text-muted-foreground group-hover:text-green-600" />
                <span className="text-sm group-hover:text-green-600">{volunteer.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{volunteer.address}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredVolunteers.length === 0 && (
        <p className="text-center mt-4 text-gray-500 h-full w-full flex justify-center items-center">
          No volunteers found.
        </p>
      )}
    </div>
  );
}
