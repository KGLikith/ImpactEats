"use client";

import { getDonorInfo } from "@/actions/global";
import Loader from "@/components/ui/loader";
import { useQueryData } from "@/hooks/useQueryData";
import { DonationType } from "@/schemas/donation-form.schema";
import { DonorType } from "@/schemas/user.schema";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Package,
  Calendar,
  Clock,
  Truck,
  ClipboardIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type DonorInfoType = DonorType & {
  donations: (DonationType & {
    claim: {
      id: string;
      status: string;
      organisation: {
        id: string;
        name: string;
        email: string;
      };
    };
  })[];
  _count: {
    donations: number;
  };
};

export default function DonorProfilePage() {
  const { id } = useParams();
  const { data, isLoading } = useQueryData(["donor", id as string], () =>
    getDonorInfo(id as string)
  );
  const [donor, setDonor] = useState<DonorInfoType>();

  useEffect(() => {
    if (data) {
      const { data: donor } = data as {
        status: number;
        data: DonorInfoType;
      };
      setDonor(donor);
    }
  }, [data]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: text,
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader state color="black" />
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="text-center p-8 text-gray-600">
        No donor information available.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 bg-gray-50">
      {/* Donor Profile */}
      <Card className="mb-6 shadow-md bg-white rounded-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={donor.imageUrl || "/placeholder.svg"}
                  alt={donor.name}
                />
                <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-bold text-gray-700">
                  {donor.name}
                </CardTitle>
                <div className="text-sm flex items-center space-x-2 mt-1">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <a
                    href={`mailto:${donor.email}`}
                    className="hover:underline text-blue-500"
                  >
                    {donor.email}
                  </a>
                  <ClipboardIcon
                    className="w-4 h-4 cursor-pointer text-gray-400 hover:text-black"
                    onClick={() => copyToClipboard(donor.email)}
                  />
                </div>
                <div className="text-sm flex items-center space-x-2 mt-1">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span>{donor.phone}</span>
                  <ClipboardIcon
                    className="w-4 h-4 cursor-pointer text-gray-400 hover:text-black"
                    onClick={() => copyToClipboard(donor.phone)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <p className="text-sm flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{donor.address}</span>
              </p>
              <p className="text-sm font-medium mt-2 text-gray-600">
                Total Donations:{" "}
                <span className="font-semibold text-blue-500">
                  {donor._count.donations}
                </span>
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Donation History */}
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Donation History
      </h2>
      <div className="space-y-4">
        {donor.donations.map((donation) => (
          <Card
            key={donation.id}
            className="shadow-sm bg-white rounded-md border"
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-md font-medium text-purple-600">
                  {donation.name}
                </CardTitle>
                <Badge
                  className={`py-1 px-3 text-xs ${
                    donation.claim?.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {donation.claim?.status || "Unclaimed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <p className="flex items-center">
                    <Package className="w-4 h-4 text-gray-400 mr-2" />
                    {donation.foodType} - {donation.quantityUnit === "WEIGHT" ? (
                      <> {donation.quantity} Kg</>
                    ) : (
                      <>Feeds {donation.quantity} people</>
                    )}
                  </p>
                  <p className="flex items-center mt-2">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    Available:{" "}
                    {format(
                      new Date(
                        `${donation.availableDate}T${donation.availableTime}:00`
                      ),
                      "PPP p"
                    )}
                  </p>
                  <p className="flex items-center mt-2">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    Expiry:{" "}
                    {format(
                      new Date(
                        `${donation.expiryDate}T${donation.expiryTime}:00`
                      ),
                      "PPP p"
                    )}
                  </p>
                </div>
                <div>
                  <p className="flex items-center">
                    <Truck className="w-4 h-4 text-gray-400 mr-2" />
                    Delivery:{" "}
                    {donation.deliveryType === "PICKUP"
                      ? "Pickup"
                      : "Self-delivery"}
                  </p>
                  {donation.claim && (
                    <div className="mt-2">
                      <p className="font-medium text-sm">Claimed by:</p>
                      <p className="flex items-center">
                        <span>{donation.claim.organisation.name}</span>
                        <Link
                          href={`/organisation/${donation.claim.organisation.id}`}
                          className="text-blue-500 text-xs hover:underline"
                        >
                          View
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <Link
                  href={`/donation/${donation.id}`}
                  className="text-blue-500 text-sm hover:underline"
                >
                  View Details
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
