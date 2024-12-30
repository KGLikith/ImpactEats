import { HistoryItem } from "./page";
import {  Gift, HandHeart, ShoppingBag, User } from "lucide-react";

export const getActionIcon = (type: HistoryItem["type"]) => {
  switch (type) {
    case "Donation":
      return <Gift className="h-6 w-6 text-green-500" />;
    case "Volunteering":
      return <HandHeart className="h-6 w-6 text-blue-500" />;
    case "Claim":
      return <ShoppingBag className="h-6 w-6 text-purple-500" />;
    default:
      return <User className="h-6 w-6 text-gray-500" />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CLAIMED":
      return "bg-blue-100 text-blue-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusMessage = (item: HistoryItem) => {
  if (item.type === "Donation") {
    switch (item.donation?.status) {
      case "PENDING":
        return "Thank you for your donation! Wait to be claimed by the organization.";
      case "COMPLETED":
        return "This donation needs is completed.";
      case "CLAIMED": {
        if (item.donation?.deliveryType === "pickup") {
          return "Your donation has been claimed and is awaiting pickup by the volunteer.";
        }
        return "Your donation has been claimed and is awaiting to be delivered by you.";
      }
      case "CANCELLED":
        return "This donation has been cancelled.";
      default:
        return "";
    }
  }
  return "";
};

export const getCardStyle = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-50 border-green-500";
    case "PENDING":
      return "bg-yellow-50 border-yellow-500";
    case "CLAIMED":
      return "bg-blue-50 border-blue-500";
    case "CANCELLED":
      return "bg-red-50 border-red-500";
    default:
      return "bg-gray-50 border-gray-300";
  }
};
