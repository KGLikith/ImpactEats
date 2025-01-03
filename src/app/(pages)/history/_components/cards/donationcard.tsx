import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Volunteer } from "../volunteer";
import { Organization } from "../organisation";
import { formatDate } from "@/constants/forms";
import { getActionIcon, getCardStyle, getStatusColor } from "../constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HistoryItem } from "../../HistoryList";
import { Donor } from "../donor";

type Props = {
  item: HistoryItem;
  type: string;
};

export default function Donationcard({ item, type }: Props) {
  return (
    <Card
      key={item.id}
      className={`w-full h-fit border ${getCardStyle(
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
          <p>{item.description}</p>
          <p className="mt-2 text-sm font-medium text-blue-600">
            {item.message}
          </p>
          {item.timing && (
            <p className="mt-2 text-sm text-muted-foreground">
              {item.timing?.split(".").map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {item.timing && index < item.timing.split(",")?.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          )}
        </CardContent>

        {type !== "Donor" && (
          <>
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">Donor</h3>
            {item.donation?.donor ? (
              <Donor {...item.donation.donor} />
            ) : (
              <p className="text-sm text-muted-foreground">No donor yet.</p>
            )}
          </div>
          </>
        )}

        {/* Organisation */}
        {type !== "Organisation" && (
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">Claimed Organization</h3>
            {item.donation?.claim?.organisation ? (
              <Organization {...item.donation.claim.organisation} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No organization claimed yet.
              </p>
            )}
          </div>
        )}

        {/* Volunteer */}
        {type !== "Volunteer" && (
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
        )}
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
