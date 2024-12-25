import React, { useEffect } from "react";
import ProfilePicture from "../ProfilePicture";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserType } from "../../page";
import OrganisationForm from "./OrganisationForm";
import { UserTypeInfo } from "../UserProfile/ProfileForm";
import { useGetUserTypeInfo } from "@/hooks/user";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

type Props = {
  user: UserType;
};

export default function OrganisationPage({ user }: Props) {
    const [userType, setUserType] = React.useState<UserTypeInfo>();
  const { userType: currentUserType, isLoading } = useGetUserTypeInfo(
    user.id,
    user.type
  );
  useEffect(() => {
    if (currentUserType) {
      setUserType(currentUserType);
    }
  }, [currentUserType]);

  if (!isLoading && !currentUserType)
    return (
      <div className="w-full flex-1 h-screen flex gap-3 flex-col justify-center items-center text-xl font-bold">
        Something went wrong... <br />
        <Button
          className="font-normal cursor-pointer"
          onClick={() => window.location.reload()}
        >
          Please Refresh
        </Button>
      </div>
    );

  if (!userType) {
    return (
      <div className="flex flex-1 w-full h-screen justify-center items-center">
        <Loader state color="black" />
      </div>
    );
  }
  return (
    <div className="flex gap-6">
      <div className="flex gap-6 flex-col flex-1">
        <ProfilePicture
          userImage={user.imageUrl || ""}
          id={user.id}
          type={user.type}
        />
        <div className="flex flex-col gap-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email" className="text-lg">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={user.email}
              disabled={true}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="type" className="text-lg">
              Type
            </Label>
            <Input
              type="type"
              id="type"
              placeholder="type"
              value={user.type}
              disabled={true}
            />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <OrganisationForm organisation={userType} />
      </div>
    </div>
  );
}
