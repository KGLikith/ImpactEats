// Updated DonationsPage Component
"use client";

import { getAllDonations } from "@/actions/donation";
import Loader from "@/components/ui/loader";
import { useQueryData } from "@/hooks/useQueryData";
import React, { useEffect, useState } from "react";
import { DonationCard } from "./donation-card";

import { DonationType } from "@/schemas/donation-form.schema";
import { DonorType } from "@/schemas/user.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the Donation type
export type Donation = DonationType & {
  donor: DonorType;
};

export default function DonationsPage() {
  const { data, isLoading } = useQueryData(["all-donations"], getAllDonations);
  const [donationData, setDonationData] = useState<Donation[] | null>(null);
  const [sortOption, setSortOption] = useState("latest");
  console.log(data)
  useEffect(() => {
    if (data) {
      const { data: fetchedData } = data as {
        status: number;
        data: Donation[];
      };
      // Sort data based on the selected option
      const sortedData = [...fetchedData].sort((a, b) => {
        const dateA = new Date(a.availableDate);
        const dateB = new Date(b.availableDate);
        return sortOption === "latest"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      });
      setDonationData(sortedData);
    }
  }, [data, sortOption]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader state color="black" />
      </div>
    );
  }
  console.log(donationData)

  return (
    <>
      <div className="container mx-auto py-8 h-full w-full">
        <h1 className="text-3xl font-bold mb-6">All Donations</h1>

        {/* Sort Dropdown */}
        <div className="flex justify-end mb-4 w-1/4">
          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Select food type"
                defaultValue={sortOption}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest to Oldest</SelectItem>
              <SelectItem value="oldest">Oldest to Latest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Donation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donationData?.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
        {donationData?.length === 0 && (
        <div className="flex justify-center items-center w-full h-3/4">
          <p className="text-lg text-center">No donations available</p>
        </div>
      )}
      </div>
      
    </>
  );
}
