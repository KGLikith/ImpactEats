import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MailIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { callPhone, sendEmail } from "./constantfxn";
import { handleClaimDonation } from "@/actions/donation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutationData } from "@/hooks/useMutationData";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";

type Props = {
  claim?: {
    organisation: {
      imageUrl?: string;
      name: string;
      email: string;
      phone: string;
    };
    status: "CLAIMED" | "ASSIGNED" | "RECIEVED" | "CANCELLED";
    organisationId: string;
  };
  userType: {
    id: string;
    type: string;
  };
  donationId: string;
};

const getBackgroundColor = (status?: string) => {
  switch (status) {
    case "CLAIMED":
      return "bg-yellow-100";
    case "ASSIGNED":
      return "bg-yellow-50";
    case "RECIEVED":
      return "bg-green-50";
    case "CANCELLED":
      return "bg-red-50";
    default:
      return "bg-gray-50";
  }
};

export default function ClaimInfo({ claim, userType, donationId }: Props) {
  const queryclient = useQueryClient();
  const { mutate } = useMutationData(
    ["claimDonation"],
    ({ donationId, userId }: { donationId: string; userId: string }) =>
      handleClaimDonation(donationId, userId),
    "ClaimsList",
    async (data) => {
      console.log(data);
      setOpen(false);
      setLoading(false);
      await queryclient.invalidateQueries({
        queryKey: ["donation", donationId],
      });
      toast({
        title: "Success",
        description: "Claimed successfully",
        duration: 2000,
      });
    },
    () => {
      toast({
        title: "Error",
        description: "Something went wrong,please try again later",
        duration: 2000,
      });
      setLoading(false);
    }
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setLoading(false);
        }}
      >
        <DialogContent className="p-6 rounded-lg shadow-lg bg-gray-50">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Claim Donation
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              Are you sure you want to claim this donation?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            {!loading ? (
              <Button
                className="px-4 py-2 text-sm font-medium text-zinc-200 border border-gray-300 rounded-md hover:bg-gray-800 focus:outline-none transition-transform duration-200 hover:scale-105"
                onClick={() => {
                  setLoading(true);
                  console.log("hello");
                  mutate({ donationId, userId: userType.id });
                }}
              >
                Claim
              </Button>
            ) : (
              <Button
                className="flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                disabled
              >
                <Loader state color="black" className="w-4 h-4 animate-spin" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
        className={`p-6 rounded-lg shadow-lg ${getBackgroundColor(
          claim?.status
        )}`}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Claim Information
        </h2>
        <div className="flex items-center space-x-4">
          {claim ? (
            <>
              <Badge
                className={`mb-2 ${
                  claim.status === "CANCELLED" ? "bg-red-100 text-red-800" : ""
                }`}
              >
                {claim.status}
              </Badge>
              <Separator color="black" orientation="vertical" />
              <Avatar className="h-16 w-16 border border-gray-300">
                {claim.organisation.imageUrl ? (
                  <AvatarImage
                    src={claim.organisation.imageUrl}
                    alt={claim.organisation.name}
                  />
                ) : (
                  <AvatarFallback>
                    {claim.organisation.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <Link
                  href={`/organisations/${claim.organisationId}`}
                  className="text-gray-900 font-bold hover:underline"
                >
                  {claim.organisation.name}
                </Link>
                <p className="text-gray-700">
                  <MailIcon
                    className="inline-block mr-2 h-4 w-4 text-blue-600 cursor-pointer"
                    onClick={() => claim && sendEmail(claim.organisation.email)}
                  />
                  {claim.organisation.email}
                </p>
                <p className="text-gray-700">
                  <PhoneIcon
                    className="inline-block mr-2 h-4 w-4 text-blue-600 cursor-pointer"
                    onClick={() => claim && callPhone(claim.organisation.phone)}
                  />
                  {claim.organisation.phone}
                </p>
              </div>
            </>
          ) : (
            <div className="w-full text-center">
              <p className="text-gray-700 mb-4">
                No claims yet for this donation.
              </p>
              {userType.type === "Organisation" ? (
                <button
                  className="px-3 py-1 text-sm text-zinc-200 border bg-blue-700 border-gray-300 rounded-md hover:bg-blue-600 focus:outline-none transition-transform duration-200 hover:scale-105"
                  onClick={() => setOpen(true)}
                >
                  Claim This Donation
                </button>
              ) : (
                <Badge color="gray" variant="destructive">
                  Not Claimed
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
