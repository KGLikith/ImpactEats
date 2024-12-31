import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/constants/forms";
import { getActionIcon, getCardStyle, getStatusColor } from "../constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HistoryItem } from "../../HistoryList";

type Props = {
  item: HistoryItem;
};

export default function Normalcard({ item }: Props) {
  return (
    <Card key={item.id} className={`w-full border ${getCardStyle("DEFAULT")}`}>
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
          <CardTitle className="text-lg capitalize">{item.header}</CardTitle>
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
          <p>{item?.description}</p>
          {/* {getStatusMessage(item) && (
                <p className="mt-2 text-sm font-medium text-blue-600">
                  {getStatusMessage(item)}
                </p>
              )} */}
          <p className="mt-2 text-md font-medium text-blue-600">
            {item.message}
          </p>
          {item.timing && (
            <p className="mt-2 text-sm text-muted-foreground">{item.timing}</p>
          )}
        </CardContent>

          <CardFooter>
            <Button asChild>
              <Link href={item.link || `donation/${item.donationId}`}>
                View Details
              </Link>
            </Button>
          </CardFooter>
        
      </div>
    </Card>
  );
}
