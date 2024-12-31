"use client";

import { getVolunteerInfo } from "@/actions/global";
import { useQueryData } from "@/hooks/useQueryData";
import { volunteerType } from "@/schemas/user.schema";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { formatDistanceToNow } from "date-fns";
import { ClipboardIcon, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type VolunteerInfo = volunteerType & {
  task: {
    id: string;
    status: "PENDING" | "RECIEVED" | "COMPLETED" | "CANCELLED";
    createdAt: string;
    updatedAt: string;
    Claim: {
      donation: {
        id: string;
        name: string;
        imageUrl: string;
        address: string;
      };
      organisation: {
        id: string;
        name: string;
        email: string;
        phone: string;
        imageUrl: string;
        address: string;
      };
    };
  }[];
  organisations: {
    id: string;
    name: string;
    phone: string;
    email: string;
    imageUrl: string;
    address: string;
  }[];
  _count: {
    task: number;
  };
};

export default function VolunteerPage() {
  const { id } = useParams();
  const { data, isPending } = useQueryData(["volunteer", id as string], () =>
    getVolunteerInfo(id as string)
  );
  const [volunteerData, setVolunteerData] = useState<VolunteerInfo | null>(
    null
  );

  useEffect(() => {
    if (data) {
      const responseData = data as {
        status: number;
        data: VolunteerInfo;
      };
      setVolunteerData(responseData.data);
    }
  }, [data]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
      case "RECIEVED":
        return "bg-yellow-200 text-yellow-800";
      case "COMPLETED":
        return "bg-green-200 text-green-800";
      case "CANCELLED":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader state color="black" />
      </div>
    );
  }

  if (!volunteerData) {
    return <div className="text-center">No volunteer data available.</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Volunteer Profile */}
      <Card className="shadow-md flex justify-between items-center">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={volunteerData.imageUrl || "/placeholder.svg"}
                alt={volunteerData.name}
              />
              <AvatarFallback>{volunteerData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <CardTitle className="text-2xl">{volunteerData.name}</CardTitle>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-blue-600" />
                <a
                  href={`mailto:${volunteerData.email}`}
                  className="hover:underline text-blue-600"
                >
                  {volunteerData.email}
                </a>
                <ClipboardIcon
                  className="h-4 w-4 cursor-pointer text-gray-500 hover:text-black"
                  onClick={() => copyToClipboard(volunteerData.email)}
                />
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-green-600" />
                <span>{volunteerData.phone}</span>
                <ClipboardIcon
                  className="h-4 w-4 cursor-pointer text-gray-500 hover:text-black"
                  onClick={() => copyToClipboard(volunteerData.phone)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-between items-center p-0 pr-6">
          <div className="flex justify-start flex-col gap-6">
            <div className="flex gap-1">
              <p className="font-semibold">Tasks Completed:</p>
              <p>{volunteerData._count.task}</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold">Organizations:</p>
              <p>{volunteerData.organisations.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Navigation */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
        </TabsList>

        {/* Tasks Section */}
        <TabsContent value="tasks">
          <h2 className="text-2xl font-bold mb-4">Tasks</h2>
          <div className="space-y-4">
            {volunteerData.task.map((task) => (
              <Card key={task.id} className="shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Task: {task.id}</CardTitle>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    {task.status === "PENDING" || task.status === "RECIEVED"
                      ? `Assigned ${formatDistanceToNow(
                          new Date(task.createdAt)
                        )} ago`
                      : task.status === "COMPLETED"
                      ? `Completed ${formatDistanceToNow(
                          new Date(task.updatedAt)
                        )} ago`
                      : null}
                  </p>
                  <div className="mt-4">
                    <h3 className="font-semibold">Donation:</h3>
                    <p>{task.Claim.donation.name}</p>
                    <p>Address: {task.Claim.donation.address}</p>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold">Organization:</h3>
                    <p>{task.Claim.organisation.name}</p>
                    <p>Email: {task.Claim.organisation.email}</p>
                    <p>Phone: {task.Claim.organisation.phone}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Organizations Section */}
        <TabsContent value="organizations">
          <h2 className="text-2xl font-bold mb-4">Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {volunteerData.organisations.map((org) => (
              <Card key={org.id} className="shadow-md">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={org.imageUrl || "/placeholder.svg"}
                        alt={org.name}
                      />
                      <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{org.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <a
                      href={`mailto:${org.email}`}
                      className="hover:underline text-blue-600"
                    >
                      {org.email}
                    </a>
                    <ClipboardIcon
                      className="h-4 w-4 cursor-pointer text-gray-500 hover:text-black"
                      onClick={() => copyToClipboard(org.email)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>{org.phone}</span>
                    <ClipboardIcon
                      className="h-4 w-4 cursor-pointer text-gray-500 hover:text-black"
                      onClick={() => copyToClipboard(org.phone)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span>{org.address}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
