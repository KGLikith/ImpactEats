"use client";
import React, { useEffect, useState } from "react";
import { useQueryData } from "@/hooks/useQueryData";
import { getNotifications } from "@/actions/user";
import Loader from "@/components/ui/loader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatDate } from "@/constants/forms";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Info, AlertCircle, CheckCircle } from "lucide-react";
import { useMutationData } from "@/hooks/useMutationData";
import {
  deleteAllUserNotifications,
  deleteNotification,
} from "@/actions/global";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const { data: notifications, isLoading } = useQueryData(
    ["user-notifications"],
    getNotifications
  );
  const [swipingOut, setSwipingOut] = useState<string | null>(null);
  const [swipingAllOut, setSwipingAllOut] = useState<boolean>(false);
  const { mutate, isPending } = useMutationData(
    ["mark-as-read"],
    async (id) => {
      await deleteNotification(id);
    },
    "user-notifications",
    (data) => {
      console.log("Notification marked as read", data);
      toast({
        title: "Notification marked as read",
        duration: 2000,
      });
    }
  );
  const { mutate: AllNotificationMutate, isPending: AllNotificationPending } =
    useMutationData(
      ["mark-all-as-read"],
      async (userId) => {
        await deleteAllUserNotifications(userId);
      },
      "user-notifications",
      (data) => {
        console.log("Notifications marked as read", data);
        toast({
          title: "Notifications marked as read",
          duration: 2000,
        });
      }
    );
  useEffect(() => {
    if (!isPending && swipingOut) {
      setSwipingOut(null);
    }
  }, [isPending, swipingOut]);
  useEffect(() => {
    if (!isPending && swipingOut) {
      setSwipingAllOut(false);
    }
  }, [AllNotificationPending, swipingOut]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader state color="black" />
      </div>
    );
  }

  const {
    data: notification,
    status,
    unreadNotifications: unread,
  } = notifications as {
    status: number;
    data: {
      Notification: {
        id: string;
        header: string;
        userId: string;
        action: string;
        message: string;
        link: string | null;
        isRead: boolean;
        createdAt: string;
      }[];
      _count: {
        Notification: number;
      };
    };
    unreadNotifications: number;
  };

  const markAsReadWithAnimation = (id: string) => {
    mutate(id);
    setSwipingOut(id);
  };

  const deleteAllNotifications = () => {
    AllNotificationMutate(notification.Notification[0].userId);
    setSwipingAllOut(true);
  };

  if (status !== 200) {
    return (
      <div className="px-2 space-y-4  min-h-screen">
        <div className="bg-white p-4 rounded-lg shadow-sm h-full w-full">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <div className="h-full w-full flex justify-center items-center">
            No unread notifications
          </div>
        </div>
      </div>
    );
  }

  const getNotificationIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "created":
        return <Info className="h-6 w-6 text-blue-500" />;
      case "claimed":
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="px-2 space-y-4  min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-blue-600 mt-2">
            You have {unread} unread notification{unread !== 1 ? "s" : ""}
          </p>
        </div>
        <div>
          <Button
            onClick={() => deleteAllNotifications()}
            size="lg"
            variant="outline"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Mark All as Read
          </Button>
        </div>
      </div>
      {notification.Notification.map((item) => (
        <Card
          key={item.id}
          className={`w-full transition-all duration-500 ease-in-out ${
            swipingOut === item.id || swipingAllOut
              ? "transform translate-x-full opacity-0"
              : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="flex-shrink-0">
              {getNotificationIcon(item.action)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg capitalize text-gray-800">
                {item.header}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {formatDate(item.createdAt)}
              </p>
            </div>
          </CardHeader>
          <div className="flex w-full h-full justify-between items-start gap-4 p-4 border-t border-gray-100">
            <CardContent className="p-0">
              <p className="text-gray-700">{item.message}</p>
            </CardContent>
            <div className="flex  justify-between items-center gap-2">
              {item.link && (
                <CardFooter className="p-0">
                  <Button asChild variant="outline" size="lg">
                    <Link href={item.link}>View Details</Link>
                  </Button>
                </CardFooter>
              )}
              <Button
                onClick={() => markAsReadWithAnimation(item.id)}
                size="lg"
              >
                Mark as Read
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
