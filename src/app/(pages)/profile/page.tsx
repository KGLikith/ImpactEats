"use client";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/hooks/user";
import React from "react";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import ProfilePage from "./_components/UserProfile/ProfilePage";
import ProfilePicture from "./_components/ProfilePicture";
import OrganisationPage from "./_components/OrganisationProfile/OrganisationPage";

export interface UserType {
  id: string;
  fullName: string;
  type: string;
  email: string;
  adress?: string;
  imageUrl?: string;
  clerkId: string;
}

export default function Page() {
  const [user, setUser] = React.useState<UserType | null>(null);
  const { user: currentUser, isLoading } = useGetUser();

  React.useEffect(() => {
    if (currentUser) setUser(currentUser);
  }, [currentUser]);

  if (!isLoading && !user)
    return (
      <div className="w-full h-screen flex gap-3 flex-col justify-center items-center text-xl font-bold">
        Something went wrong... <br />
        <Button
          className="font-normal cursor-pointer"
          onClick={() => window.location.reload()}
        >
          Please Refresh
        </Button>
      </div>
    );

  if (!user) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Loader state color="black" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full my-5 mb-20 ">
      <h2 className="text-2xl font-extrabold">Profile</h2>
      <p className="text-base text-black/50">Add or update your information</p>
      {user.type !== "Organisation" && (
        <div className={cn("flex flex-col  gap-6 mt-5 w-full pb-20")}>
          <h2 className={cn("text-xl font-bold ")}>User Details</h2>
          <div className={cn("w-full flex gap-6")}>
            <ProfilePage user={user} />
            <ProfilePicture userImage={user.imageUrl || ""} id={user.id} />
          </div>
        </div>
      )}
      {user.type === "Organisation" && (
        <div className={cn("flex flex-col  gap-6 mt-5 w-full pb-20")}>
          <h2 className={cn("text-xl font-bold ")}>Organisation Details</h2>
          <OrganisationPage user={user} />
        </div>
      )}
    </div>
  );
}
