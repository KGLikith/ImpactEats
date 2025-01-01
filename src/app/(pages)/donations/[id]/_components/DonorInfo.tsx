import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MailIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { callPhone, sendEmail } from "./constantfxn";

type Props = {
  donor: {
    id: string;
    name: string;
    phone: string;
    email: string;
    imageUrl?: string;
  };
};

export default function DonorInfo({ donor }: Props) {
  return (
    <>
      <div className="p-6 rounded-lg bg-gray-50 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Donor Information
        </h2>
        <div className="flex items-center">
          <Avatar className="h-16 w-16">
            {donor.imageUrl ? (
              <AvatarImage src={donor.imageUrl} alt={donor.name} />
            ) : (
              <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div className="ml-4">
            <Link
              href={`/donors/${donor.id}`}
              className="text-gray-900 font-bold hover:underline"
            >
              {donor.name}
            </Link>
            <p className="text-gray-700">
              <MailIcon
                className="inline-block mr-2 h-4 w-4 text-blue-600 cursor-pointer"
                onClick={() => sendEmail(donor.email)}
              />
              {donor.email}
            </p>
            <p className="text-gray-700">
              <PhoneIcon
                className="inline-block mr-2 h-4 w-4 text-blue-600 cursor-pointer"
                onClick={() => callPhone(donor.phone)}
              />
              {donor.phone}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
