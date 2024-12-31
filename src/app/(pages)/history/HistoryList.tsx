"use client";
import { getDonorHistory } from "@/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { useQueryData } from "@/hooks/useQueryData";
import React, { useEffect } from "react";
import Donationcard from "./_components/cards/donationcard";
import { UserTypeInfo } from "@/schemas/user.schema";
import Normalcard from "./_components/cards/normalCard";

export type HistoryItem = {
  id: string;
  action: string;
  type: "Donation" | "Volunteering" | "Claim";
  description: string;
  link?: string;
  updatedAt: string;
  header: string;
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
    donor: {
      id: string;
      name: string;
      email: string;
      phone: string;
      imageUrl: string;
    };
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

export default function HistoryList({userType}:{userType: UserTypeInfo}) {
  const [HistoryData, setHistory] = React.useState<HistoryItem[]>([]);
  const { data: history, isLoading } = useQueryData(
    ["user-history"],
    getDonorHistory
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
        <p className="flex justify-center items-center h-full">
          No Active History
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4" >
      <h1 className="text-2xl font-bold mb-6">Activity History</h1>
      {HistoryData.map((item) => (
        <>
          {item.donation ? (
            <Donationcard key={item.id} item={item} type={userType.type} />
          ) : (
            <Normalcard key={item.id} item={item} />
          )}
        </>
      ))}
    </div>
  );
}

            // <div key={item.id} className="flex flex-col gap-2">
            //   <div className="flex flex-row items-center gap-4 pb-2">
            //     <Avatar>
            //       <AvatarImage
            //         src={`https://api.dicebear.com/6.x/initials/svg?seed=${item.type}`}
            //       />
            //       <AvatarFallback>
            //         <User />
            //       </AvatarFallback>
            //     </Avatar>
            //     <div className="flex-1">
            //       <h2 className="text-lg capitalize">{item.type}</h2>
            //       <p className="text-sm text-muted-foreground">
            //         {formatDate(item.updatedAt)}
            //       </p>
            //     </div>
            //     {getActionIcon(item.type)}
            //     {/* {item.donation && item.donation.status && (
            //       <Badge className={getStatusColor(item.donation.status)}>
            //         {item.donation.status}
            //       </Badge>
            //     )} */}
            //   </div>
            //   <div className="flex w-full h-full justify-between items-start gap-4">
            //     <div>
            //       <p>{item.description}</p>
            //       <p className="mt-2 text-sm font-medium text-blue-600">
            //         {item.message}
            //       </p>
            //       {item.timing && (
            //         <p className="mt-2 text-sm text-muted-foreground">
            //           {item.timing}
            //         </p>
            //       )}
            //     </div>
            //   </div>
            // </div>