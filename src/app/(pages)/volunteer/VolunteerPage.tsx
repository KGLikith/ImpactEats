"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQueryData } from "@/hooks/useQueryData";
import { getCliamedDonations } from "@/actions/volunteer/page";
import Link from "next/link";
import React, { useEffect } from "react";
import { DonationType } from "@/schemas/donation-form.schema";

type Props = {
  userType: {
    type: string;
    id: string;
    email: string;
  };
};

export type ClaimType = {
  id: string;
  status: string;
  
  donation: DonationType;
};

export type OrganizationResponse = {
  id: string;
  name: string;
  status: string;
  phone: string;
  email: string;
  claims: ClaimType[];
};

export default function DonationsAndOrganizationsPage({ userType }: Props) {
  const { data, isLoading } = useQueryData(["claimedDonations"], () => {
    return getCliamedDonations(userType.id);
  });

  const [organizations, setOrganizations] = React.useState<OrganizationResponse[]>([]);

  useEffect(() => {
    if (data) {
      const { data: fetchedData } = data as {
        status: number;
        data: OrganizationResponse[];
      };
      setOrganizations(fetchedData);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6 shadow-xl border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-4">Volunteer Dashboard</CardTitle>
          <CardDescription className="text-gray-600">
            Track and manage claimed donations from various organizations.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-8 space-y-6">
        {organizations.map((org) => (
          <Card key={org.id} className="shadow-lg border border-gray-200 p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">{org.name}</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                <strong>Email:</strong> {org.email} | <strong>Phone:</strong> {org.phone} |{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {org.claims.map((claim) => (
                <div key={claim.id} className="mb-6 p-4 rounded-lg border border-gray-300 w-fit">
                  <h3 className="font-semibold text-lg">{claim.donation.name}</h3>
                  <p className="text-sm text-gray-500">{claim.donation.description}</p>
                  <div className="mt-2 text-sm space-y-1">
                    <p>
                      <strong>Food Type:</strong> {claim.donation.foodType}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {claim.donation.quantity}{" "}
                      {claim.donation.quantityUnit}
                    </p>
                    <p>
                      <strong>Available:</strong> {claim.donation.availableDate} at{" "}
                      {claim.donation.availableTime}
                    </p>
                    <p>
                      <strong>Expires:</strong> {claim.donation.expiryDate} at{" "}
                      {claim.donation.expiryTime}
                    </p>
                    <p>
                      <strong>Delivery Option:</strong>{" "}
                      {claim.donation.deliveryOption ? "Yes" : "No"}
                    </p>
                    {claim.donation.deliveryType && (
                      <p>
                        <strong>Delivery Type:</strong> {claim.donation.deliveryType}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Badge>{claim.status}</Badge>
                    <Link href={`/donations/${claim.donation.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        {organizations.length === 0 && (
          <div className="flex justify-center items-center w-full h-3/4">
            <p className="text-lg text-center">No claimed donations available</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Volunteer Dashboard
      </h1>
      <div className="mb-8">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
