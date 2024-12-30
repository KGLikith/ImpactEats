"use client";
import React, { useState } from "react";

type initialValueProps = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const initialValue: initialValueProps = {
  currentStep: 1,
  setCurrentStep: () => undefined,
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

  const values = {
    currentStep,
    setCurrentStep,
  };

  return <Provider value={values}>{children}</Provider>;
};

export const useDonationContextHook = () => {
  const state = React.useContext(donationContext);
  return state;
};
