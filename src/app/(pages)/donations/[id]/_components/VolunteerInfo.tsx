import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MailIcon, PhoneIcon } from 'lucide-react';
import Link from "next/link";
import { callPhone, sendEmail } from "./constantfxn";
import { handleVolunteerForDonation } from "@/actions/donation";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutationData } from "@/hooks/useMutationData";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateTaskStatus } from "@/actions/volunteer/page";

type Props = {
  task?: {
    id: string;
    status: "PENDING" | "RECIEVED" | "CANCELLED" | "COMPLETED";
    volunteer: {
      imageUrl?: string;
      name: string;
      email: string;
      phone: string;
    };
    volunteerId: string;
  };
  userType: {
    id: string;
    type: string;
  };
  donationId: string;
  claimId?: string;
};

const getBackgroundColor = (status?: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-50";
    case "RECIEVED":
      return "bg-blue-50";
    case "CANCELLED":
      return "bg-red-50";
    case "COMPLETED":
      return "bg-green-50";
    default:
      return "bg-gray-50";
  }
};

const getAvailableStatuses = (currentStatus: string) => {
  switch (currentStatus) {
    case "PENDING":
      return ["RECIEVED", "CANCELLED"];
    case "RECIEVED":
      return ["COMPLETED"];
    default:
      return [];
  }
};

export default function VolunteerInfo({
  task,
  userType,
  donationId,
  claimId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const { mutate: volunteerMutate } = useMutationData(
    ["volunteerForDonation"],
    ({ donationId, userId, claimId }: { donationId: string; userId: string; claimId: string }) =>
      handleVolunteerForDonation(donationId, userId, claimId),
    "VolunteerList",
    async (data) => {
      setOpen(false);
      console.log(data)
      setLoading(false);
      await queryClient.invalidateQueries({
        queryKey: ["donation", donationId],
      });
      toast({
        title: "Success",
        description: "Volunteered successfully",
        duration: 2000,
      });
    },
    () => {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        duration: 2000,
      });
      setLoading(false);
    }
  );

  const { mutate: updateStatusMutate,  } = useMutationData(
    ["updateTaskStatus"],
    ({ taskId, newStatus }: { taskId: string; newStatus: string }) =>
      updateTaskStatus(taskId, newStatus),
    "TaskStatus",
    async (data) => {
      setUpdateOpen(false);
      console.log(data)
      setLoading(false);
      await queryClient.invalidateQueries({
        queryKey: ["donation", donationId],
      });
      toast({
        title: "Success",
        description: "Task status updated successfully",
        duration: 2000,
      });
    },
    () => {
      toast({
        title: "Error",
        description: "Failed to update task status, please try again later",
        duration: 2000,
      });
      setLoading(false);
    }
  );

  const handleStatusUpdate = () => {
    if (task && newStatus) {
      setLoading(true);
      updateStatusMutate({ taskId: task.id, newStatus });
    }
  };

  const canUpdateStatus = task && ["PENDING", "RECIEVED"].includes(task.status);

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
              Volunteer for Donation
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              Are you sure you want to volunteer for this donation?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            {!loading ? (
              <Button
                className="px-4 py-2 text-sm font-medium text-zinc-200 border border-gray-300 rounded-md hover:bg-gray-800 focus:outline-none transition-transform duration-200 hover:scale-105"
                onClick={() => {
                  setLoading(true);
                  if (claimId) {
                    volunteerMutate({ donationId, userId: userType.id, claimId });
                  }
                }}
              >
                Volunteer
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

      {canUpdateStatus && (
        <Dialog
          open={updateOpen}
          onOpenChange={() => {
            setUpdateOpen(false);
            setLoading(false);
          }}
        >
          <DialogContent className="p-6 rounded-lg shadow-lg bg-gray-50">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Update Task Status
              </DialogTitle>
              <DialogDescription className="text-gray-700">
                Please select the new status for this task.
              </DialogDescription>
            </DialogHeader>
            <Select onValueChange={(value) => setNewStatus(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableStatuses(task?.status || "").map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter className="flex justify-center">
              {!loading ? (
                <Button
                  className="px-4 py-2 text-sm font-medium text-zinc-200 border border-gray-300 rounded-md hover:bg-gray-800 focus:outline-none transition-transform duration-200 hover:scale-105"
                  onClick={handleStatusUpdate}
                >
                  Update Status
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
      )}

      <div className={`p-6 rounded-lg shadow-lg ${getBackgroundColor(task?.status)}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Volunteer Task Information
        </h2>
        <div className="flex items-center space-x-4">
          {task ? (
            <>
              <Badge
                className={`mb-2 ${
                  task.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                  task.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                  task.status === "RECIEVED" ? "bg-blue-100 text-blue-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.status}
              </Badge>
              <Avatar className="h-16 w-16">
                {task.volunteer.imageUrl ? (
                  <AvatarImage
                    src={task.volunteer.imageUrl}
                    alt={task.volunteer.name}
                  />
                ) : (
                  <AvatarFallback>{task.volunteer.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <Link
                  href={`/volunteers/${task.volunteerId}`}
                  className="text-gray-900 font-bold hover:underline"
                >
                  {task.volunteer.name}
                </Link>
                <p className="text-gray-700">
                  <MailIcon
                    className="inline-block mr-2 h-4 w-4 text-blue-600 cursor-pointer"
                    onClick={() => sendEmail(task.volunteer.email)}
                  />
                  {task.volunteer.email}
                </p>
                <p className="text-gray-700">
                  <PhoneIcon
                    className="inline-block mr-2 h-4 w-4 text-blue-600 cursor-pointer"
                    onClick={() => callPhone(task.volunteer.phone)}
                  />
                  {task.volunteer.phone}
                </p>
                {canUpdateStatus && userType.id === task.volunteerId && (
                  <Button
                    className="mt-2 px-3 py-1 text-sm text-zinc-200 border bg-blue-700 border-gray-300 rounded-md hover:bg-blue-600 focus:outline-none transition-transform duration-200 hover:scale-105"
                    onClick={() => setUpdateOpen(true)}
                  >
                    Update Status
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full text-center">
              <p className="text-gray-700 mb-4">
                No volunteers yet for this task.
              </p>
              {userType.type === "Volunteer" ? (
                <button
                  className="px-3 py-1 text-sm text-zinc-200 border bg-blue-700 border-gray-300 rounded-md hover:bg-blue-600 focus:outline-none transition-transform duration-200 hover:scale-105"
                  onClick={() => setOpen(true)}
                >
                  Volunteer for This Donation
                </button>
              ) : (
                <Badge color="gray" variant="destructive">
                  No Task Assigned
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

