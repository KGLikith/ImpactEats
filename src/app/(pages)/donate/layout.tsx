import DonationFormProvider from "@/components/forms/donation-form/donation-form-provide";
import { DonationContextProvider } from "@/context/user-donation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Loyout({ children }: Props) {
  return (
    <div className="flex-1 w-full h-full">
      <DonationFormProvider>
        <DonationContextProvider>{children}</DonationContextProvider>
      </DonationFormProvider>
    </div>
  );
}
