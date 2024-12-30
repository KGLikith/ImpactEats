import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useGetUserTypeInfo } from "@/hooks/user";
import React, { useEffect } from "react";
import ProfileForm from "./ProfileForm";
import { UserType } from "../../page";
import { UserTypeInfo } from "@/schemas/user.schema";


type Props = {
  user: UserType;
};

export default function ProfilePage({ user }: Props) {
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
    <div className="flex-1">
      <ProfileForm user={user} userType={userType} />
    </div>
  );
}
