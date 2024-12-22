import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import UserTypeCard from "./user-type-card";

type Props = {
  register: UseFormRegister<FieldValues>;
  userType: "Donor" | "Volunteer" | "Organisation";
  setUserType: React.Dispatch<
    React.SetStateAction<"Donor" | "Volunteer" | "Organisation">
  >;
};

const TypeSelectionForm = ({ register, setUserType, userType }: Props) => {
  return (
    <>
      <h2 className="text-gray-400 md:text-4xl font-bold">Create an account</h2>
      <p className="text-gray-500 md:text-sm">
      Tell us how you'd like to contribute, and we’ll create an experience tailored to your role.
      </p>
      <UserTypeCard
        register={register}
        setUserType={setUserType}
        userType={userType}
        value="Donor"
        title="I want to donate food"
        text="Share surplus food and reduce waste."
      />
      <UserTypeCard
        register={register}
        setUserType={setUserType}
        userType={userType}
        value="Volunteer"
        title="I want to volunteer"
        text="Help collect, distribute, or organize food donations."
      />
      <UserTypeCard
        register={register}
        setUserType={setUserType}
        userType={userType}
        value="Organisation"
        title="We are a non-profit organization"
        text="Receive food donations and help communities in need."
      />
    </>
  );
};

export default TypeSelectionForm;
