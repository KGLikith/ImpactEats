"use client";
import React, { useState } from "react";

type initialValueProps = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  DonationId: string;
  setDonationId: React.Dispatch<React.SetStateAction<string>>;
};

const initialValue: initialValueProps = {
  currentStep: 1,
  setCurrentStep: () => undefined,
  DonationId: "",
  setDonationId: () => undefined,
};

const donationContext = React.createContext(initialValue);

const { Provider } = donationContext;

export const DonationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentStep, setCurrentStep] = useState<number>(
    initialValue.currentStep
  );
  const [DonationId, setDonationId] = useState<string>(initialValue.DonationId);


  const values = {
    currentStep,
    setCurrentStep,
    DonationId,
    setDonationId,
  };

  return <Provider value={values}>{children}</Provider>;
};

export const useDonationContextHook = () => {
  const state = React.useContext(donationContext);
  return state;
};
