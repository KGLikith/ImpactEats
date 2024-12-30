import React from "react";
import DonationPage from "./_components/DonationPage";

type Params = {
  id: string;
};

type Props = {
  params: Promise<Params>;
};

export default async function page({ params }: Props) {
  const { id } = await params;
  return (
    <div className="h-full w-full">
      <DonationPage donationId={id} />
    </div>
  );
}
