"use client";
import { getContributions } from "@/actions/user";
import Loader from "@/components/ui/loader";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";

interface Volunteer {
  id: string;
  name: string;
  phone: string;
  imageUrl: string;
  email: string;
}

interface Donor {
  id: string;
  name: string;
  phone: string;
  imageUrl: string;
  email: string;
}

interface Task {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  volunteer: Volunteer;
  claims: Claim;
}

interface Organisation {
  id: string;
  name: string;
  phone: string;
  imageUrl: string;
  email: string;
}

interface Claim {
  id: string;
  task?: Task;
  updateAt?: Date;
  organisation?: Organisation;
  donation: Donation;
}

interface Donation {
  id: string;
  quantity: number;
  quantityUnit: string;
  foodType: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  claim?: Claim;
  donor?: Donor;
}

interface ContributionsResponse {
  status: number;
  data: {
    donations?: Donation[];
    claims?: Claim[];
    task?: Task[];
  };
  type: string;
}

export default function Page() {
  const { data: contributions, isLoading } = useQueryData(
    ["user-contributions"],
    getContributions
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader state color="black" />
      </div>
    );
  }
  const { data: contributionData } = contributions as ContributionsResponse;
  const { task, donations, claims } = contributionData;

  return (
    <div className="p-4 h-screen">
      <h1 className="text-xl font-bold">Contributions</h1>
      {donations && donations.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Donations:</h3>
          <ul className="list-disc pl-5">
            {donations.map((donation) => (
              <li key={donation.id}>
                {donation.description} - {donation.quantity}{" "}
                {donation.quantityUnit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {claims && claims.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Claims:</h3>
          <ul className="list-disc pl-5">
            {claims.map((claim) => (
              <li key={claim.id}>
                {claim?.organisation?.name} - Task ID: {claim?.task?.id}
              </li>
            ))}
          </ul>
        </div>
      )}

      {task && task.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Tasks:</h3>
          <ul className="list-disc pl-5">
            {task.map((task) => (
              <li key={task.id}>
                {task?.volunteer.name} - organisaiton:{" "}
                {task?.claims?.organisation?.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fallback message if no data is available */}
      {(!donations || donations.length === 0) &&
        (!claims || claims.length === 0) &&
        (!task || task.length === 0) && (
          <div className="mt-4 text-gray-500 w-full h-full flex justify-center items-center">
            No contributions available.
          </div>
        )}
    </div>
  );
}
