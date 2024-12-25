"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { onDeleteImage, onUploadImage } from "@/actions/uploadcare";
import { useQueryClient } from "@tanstack/react-query";
import { uploadcareLoader } from "@uploadcare/nextjs-loader";
import UploadCareButton from "./UploadCareButton";

type Props = {
  id: string;
  userImage: string;
  type?: string
};

const ProfilePicture = ({ id, userImage,type }: Props) => {
  const router = useRouter();
  const queryclient = useQueryClient();

  const onRemoveProfileImage = async () => {
    const response = await onDeleteImage(id);
    await queryclient.invalidateQueries({
      queryKey: ["currentUser"],
    });
    if (response) {
      router.refresh();
    }
  };

  const onupload = async (image: string) => {
    const response = await onUploadImage(id, image);
    await queryclient.invalidateQueries({
      queryKey: ["currentUser"],
    });
    if (response) {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <p className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg ">

       { !type?"Profile Picture":"Organisation Logo"}
      </p>
      <div className="flex h-[40vh] flex-col items-center justify-center">
        {userImage ? (
          <>
            <div className="relative h-full w-1/2 flex justify-center items-center">
              <Image
                src={userImage}
                alt="User_Image"
                loader={uploadcareLoader}
                objectFit="fit"
                width={400}
                height={400}
              />
            </div>
            <Button
              onClick={onRemoveProfileImage}
              className="bg-transparent text-black/70 hover:bg-transparent hover:text-black"
            >
              <X /> Remove Logo
            </Button>
          </>
        ) : (
          <UploadCareButton onUpload={onupload} />
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
