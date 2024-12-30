"use client";
import { getHistory } from "@/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { useQueryData } from "@/hooks/useQueryData";
import { Badge, User } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { Volunteer } from "./volunteer";
import { Organization } from "./organisation";
import { formatDate } from "@/constants/forms";
import {
  getActionIcon,
  getCardStyle,
  getStatusColor,
  getStatusMessage,
} from "./constants";

export type HistoryItem = {
  id: string;
  action: string;
  type: "Donation" | "Volunteering" | "Claim";
  description: string;
  link?: string;
  updatedAt: string;
  donationId?: string;
  timing?: string;
  message: string;
  donation: {
    id: string;
    description: string;
    name: string;
    foodType: string;
    address: string;
    phone: string;
    email: string;
    quantity: number;
    quantityUnit: string;
    status: "PENDING" | "COMPLETED" | "CLAIMED" | "CANCELLED";
    deliveryType: string;
    requestId: string;
    createdAt: string;
    updatedAt: string;
    claim: {
      id: string;
      task: {
        id: string;
        volunteer: {
          id: string;
          name: string;
          email: string;
          phone: string;
          imageUrl: string;
        };
      };
      organisation: {
        id: string;
        name: string;
        email: string;
        phone: string;
        imageUrl: string;
      };
    };
  };
};

export default function HistoryPage() {
  const [HistoryData, setHistory] = React.useState<HistoryItem[]>([]);
  const { data: history, isLoading } = useQueryData(
    ["user-history"],
    getHistory
  );

  useEffect(() => {
    if (history) {
      const { data: historyData, status } = history as {
        status: number;
        data: HistoryItem[];
      };
      if (status === 200) {
        setHistory(historyData);
      }
    }
  }, [history]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader state color="black" />
      </div>
    );
  }

  // console.log("History Data Stringified:", JSON.stringify(historyData[0], null, 2));

  if (HistoryData.length === 0) {
    return (
      <div className="container mx-auto p-4 h-screen space-y-4">
        <h1 className="text-2xl font-bold mb-6">Activity History</h1>
        <p className="flex justify-center items-center h-full">No Active History</p>
      </div>
    );
  }
  console.log(HistoryData);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Activity History</h1>
      {HistoryData.map((item) => (
        <Card
          key={item.id}
          className={`w-full border ${getCardStyle(
            item.donation?.status || "DEFAULT"
          )}`}
        >
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${item.type}`}
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg capitalize">{item.type}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatDate(item.updatedAt)}
              </p>
            </div>
            {getActionIcon(item.type)}
            {item.donation && item.donation.status && (
              <Badge className={getStatusColor(item.donation.status)}>
                {item.donation.status}
              </Badge>
            )}
          </CardHeader>
          <div className="flex w-full h-full justify-between items-start gap-4">
            <CardContent>
              <p>{item.description}</p>
              {/* {getStatusMessage(item) && (
                <p className="mt-2 text-sm font-medium text-blue-600">
                  {getStatusMessage(item)}
                </p>
              )} */}
              <p className="mt-2 text-sm font-medium text-blue-600">
                  {item.message}
                </p>
              {item.timing && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.timing}
                </p>
              )}
            </CardContent>

            {/* Organisation */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Claimed Organization
              </h3>
              {item.donation?.claim?.organisation ? (
                <Organization {...item.donation.claim.organisation} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No organization claimed yet.
                </p>
              )}
            </div>

            {/* Volunteer */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Assigned Volunteer</h3>
              {item.donation?.claim?.task?.volunteer ? (
                <Volunteer {...item.donation.claim.task.volunteer} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No volunteer assigned yet.
                </p>
              )}
            </div>
            {item.donationId && (
              <CardFooter>
                <Button asChild>
                  <Link href={item.link || `donation/${item.donationId}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
