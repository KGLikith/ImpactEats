"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useQueryData } from "@/hooks/useQueryData";
import { getCliamedDonations } from "@/actions/volunteer/page";
import { DonationType } from "@/schemas/donation-form.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl sm:text-4xl font-bold">Volunteer Dashboard</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Track and manage claimed donations from various organizations
          </CardDescription>
        </CardHeader>
      </Card>
      {organizations.length === 0 ? (
        <Card className="p-6 text-center">
          <CardContent>
            <p className="text-xl text-muted-foreground">No claimed donations available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrganizationCard({ organization }: { organization: OrganizationResponse }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{organization.name}</CardTitle>
        <CardDescription>
          <span className="font-medium">Email:</span> {organization.email}
          <br />
          <span className="font-medium">Phone:</span> {organization.phone}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[300px] pr-4">
          {organization.claims.map((claim, index) => (
            <React.Fragment key={claim.id}>
              {index > 0 && <Separator className="my-4" />}
              <ClaimCard claim={claim} />
            </React.Fragment>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ClaimCard({ claim }: { claim: ClaimType }) {
  return (
    <div className="space-y-2 flex flex-col justify-between">
      <h3 className="font-semibold text-lg">{claim.donation.name}</h3>
      <p className="text-sm text-muted-foreground">{claim.donation.description}</p>
      <div className="text-sm space-y-1">
        <p><span className="font-medium">Food Type:</span> {claim.donation.foodType}</p>
        <p><span className="font-medium">Quantity:</span> {claim.donation.quantity} {claim.donation.quantityUnit}</p>
        <p><span className="font-medium">Available:</span> {claim.donation.availableDate} at {claim.donation.availableTime}</p>
        <p><span className="font-medium">Expires:</span> {claim.donation.expiryDate} at {claim.donation.expiryTime}</p>
        <p><span className="font-medium">Delivery:</span> {claim.donation.deliveryOption ? "Yes" : "No"}</p>
        {claim.donation.deliveryType && (
          <p><span className="font-medium">Delivery Type:</span> {claim.donation.deliveryType}</p>
        )}
      </div>
      <div className="flex justify-between items-center pt-2">
        <Badge variant="outline">{claim.status}</Badge>
        <Link href={`/donations/${claim.donation.id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="mb-8">
        <CardHeader className="text-center">
          <Skeleton className="h-9 w-64 mx-auto mb-2" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="flex flex-col h-[400px]">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
