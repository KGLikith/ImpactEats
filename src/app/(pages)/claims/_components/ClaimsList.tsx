import { getClaims } from "@/actions/organisations";
import Loader from "@/components/ui/loader";
import { useQueryData } from "@/hooks/useQueryData";
import { UserTypeInfo } from "@/schemas/user.schema";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

type Props = {
  userType: UserTypeInfo;
};

type ClaimType = {
  id: string;
  status: "CLAIMED" | "ASSIGNED" | "RECIEVED" | "CANCELLED";
  donation: {
    id: string;
    name: string;
    foodType: string;
    description: string;
    quantity: number;
    quantityUnit: string;
    status: string;
    availableDate: Date;
    availableTime: string;
    expiryDate: Date;
    expiryTime: string;
    deliveryOption: string;
    deliveryType: string;
    donor: {
      name: string;
      email: string;
      phone: string;
    };
  };
  task?: {
    status: "PENDING" | "RECIEVED" | "COMPLETED";
    volunteer: {
      name: string;
      email: string;
      phone: string;
    };
  };
};

const statusColors = {
  CLAIMED: "bg-blue-100 text-blue-800",
  ASSIGNED: "bg-yellow-100 text-yellow-800",
  RECIEVED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const taskStatusColors = {
  PENDING: "bg-orange-100 text-orange-800",
  RECIEVED: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-teal-100 text-teal-800",
};

export default function ClaimsList({ userType }: Props) {
  const [claims, setClaims] = useState<ClaimType[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const { data, isLoading } = useQueryData(["allClaims"], () =>
    getClaims(userType.id)
  );

  useEffect(() => {
    if (data) {
      const { data: claimsData } = data as {
        data: ClaimType[];
      };
      setClaims(claimsData);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader state color="black" />
      </div>
    );

  const filteredClaims =
    filter === "ALL"
      ? claims
      : claims.filter((claim) => claim.status === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Claims Dashboard</h1>
        <Select onValueChange={(value) => setFilter(value)} defaultValue="ALL">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Claims</SelectItem>
            <SelectItem value="CLAIMED">Pending</SelectItem>
            <SelectItem value="ASSIGNED">Assigned</SelectItem>
            <SelectItem value="RECIEVED">Recieved</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
        {filteredClaims.length !== 0 ? (
          <>
            {filteredClaims.map((claim) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                donationId={claim.donation.id}
              />
            ))}
          </>
        ) : (
          <>
            <div className=" h-full flex justify-center items-center col-span-3 text-2xl text-gray-600">
              No claims found
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ClaimCard({
  claim,
  donationId,
}: {
  claim: ClaimType;
  donationId: string;
}) {
  return (
    <Link href={`/donations/${donationId}`}>
      <Card
        className={`bg-zinc-100 border-l-4 border-l-${
          statusColors[claim.status].split(" ")[1]
        }`}
      >
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{claim.donation.name}</CardTitle>
            <Badge variant="default">{claim.status}</Badge>
          </div>
          <CardDescription>{claim.donation.foodType}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2">{claim.donation.description}</p>
          <div className="flex items-center mb-2">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>
              Available:{" "}
              {new Date(claim.donation.availableDate).toLocaleDateString()} at{" "}
              {claim.donation.availableTime}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <ClockIcon className="mr-2 h-4 w-4" />
            <span>
              Expires:{" "}
              {new Date(claim.donation.expiryDate).toLocaleDateString()} at{" "}
              {claim.donation.expiryTime}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <MapPinIcon className="mr-2 h-4 w-4" />
            <span>
              {claim.donation.deliveryOption} - {claim.donation.deliveryType}
            </span>
          </div>
          <div className="flex items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Donor: {claim.donation.donor.name}</span>
          </div>
          {claim.task && (
            <div className="mt-4">
              <Badge
                className={`${
                  taskStatusColors[claim.task.status]
                } hover:bg-white`}
              >
                {claim.task.status}
              </Badge>
              <p className="mt-2">Volunteer: {claim.task.volunteer.name}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
