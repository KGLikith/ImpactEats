'use client'
import Loader from "@/components/ui/loader";
import { useGetCurrentUserTypeInfo } from "@/hooks/user";
import React from "react";
import HistoryList from "./HistoryList";

type Props = {};

export default function HistoryPage({}: Props) {
  const { userType, isLoading } = useGetCurrentUserTypeInfo();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader state color="black" />
      </div>
    );
  }
  return <HistoryList userType={userType} />;
}
