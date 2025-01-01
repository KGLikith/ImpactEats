import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, UserIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { DonationType } from "@/schemas/donation-form.schema";
import { DonorType } from "@/schemas/user.schema";

export type DonationCardProps = {
  donation: DonationType & {
    donor: DonorType;
  };
};

export function DonationCard({ donation }: DonationCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{donation.name}</CardTitle>
        <CardDescription>{donation.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <Badge>{donation.foodType}</Badge>
          <div className="flex items-center space-x-2">
            <MapPinIcon className="w-4 h-4" />
            <span>{donation.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{donation.availableDate} at {donation.availableTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4" />
            <span>Expiry: {donation.expiryDate} at {donation.expiryTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserIcon className="w-4 h-4" />
            <span>{donation.donor.name} - {donation.donor.email} - {donation.donor.phone}</span>
          </div>
          {donation.additionalDeliveryNote && (
            <div className="flex items-center space-x-2">
              <AlertCircleIcon className="w-4 h-4" />
              <span>Note: {donation.additionalDeliveryNote}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/donations/${donation.id}`} className="text-blue-600 hover:underline">
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
