"use client";
import { useCreateDonationHook } from "@/hooks/useCreateDonation";
import React from "react";
import { DefaultOptions } from "@/schemas/donation-form.schema";
import { FormProvider } from "react-hook-form";
import { Loader } from "@/components/_components/loader";

type Props = {
  children: React.ReactNode;
  defaultValues?: DefaultOptions;
};

export default function DonationFormProvider({children,defaultValues}: Props) {
  const { form, onFormSubmit, isPending } =
    useCreateDonationHook(defaultValues);

  return (
    <FormProvider {...form}>
      <form onSubmit={onFormSubmit} className="h-screen">
        <div className="flex flex-col justify-between gap-3 h-full">
          <Loader loading={isPending}>{children}</Loader>
        </div>
      </form>
    </FormProvider>
  );
}
