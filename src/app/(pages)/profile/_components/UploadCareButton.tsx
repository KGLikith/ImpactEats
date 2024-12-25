"use client";
import React from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

type Props = {
  onUpload: (e: string) => any;
};

const UploadCareButton = ({ onUpload }: Props) => {
  // const router = useRouter();

  const handleChangeEvent = (e: any) => {
    if (e?.allEntries[0]?.cdnUrl) {
      onUpload(e.allEntries[0].cdnUrl);
    }
  };

  return (
    <div>
      <FileUploaderRegular
        pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || ""}
        onChange={handleChangeEvent}
        onFileUploadFailed={(e) => console.log(e, "e")}
        maxLocalFileSizeBytes={2000000}
      />
    </div>
  );
};

export default UploadCareButton;
