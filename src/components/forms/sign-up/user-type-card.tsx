"use client";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  value: string;
  title: string;
  text: string;
  register: UseFormRegister<FieldValues>;
  userType: "Donor" | "Volunteer" | "Organisation";
  setUserType: React.Dispatch<
    React.SetStateAction<"Donor" | "Volunteer" | "Organisation">
  >;
};

const UserTypeCard = ({
  register,
  setUserType,
  text,
  title,
  userType,
  value,
}: Props) => {
  return (
    <Label htmlFor={value}>
      <Card
        className={cn(
          "w-full cursor-pointer bg-black border-2",
          userType == value && "border-teal-300 "
        )}
      >
        <CardContent className="flex justify-between p-2 ">
          <div className="flex items-center gap-3">
            <Card
              className={cn(
                "flex justify-center p-3 bg-black border-2",
                userType == value && "border-teal-300 "
              )}
            >
              <User
                size={30}
                className={cn(
                  userType == value ? " text-teal-300" : "text-gray-400 "
                )}
              />
            </Card>
            <div className="">
              <CardDescription className="text-gray-500">
                {title}
              </CardDescription>
              <CardDescription className="text-gray-400">
                {text}
              </CardDescription>
            </div>
          </div>
          <div>
            <div
              className={cn(
                "w-4 h-4 rounded-full",
                userType == value ? "bg-green-500" : "bg-transparent"
              )}
            >
              <Input
                {...register("type", {
                  onChange: (event) => setUserType(event.target.value),
                })}
                value={value}
                id={value}
                className="hidden"
                type="radio"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Label>
  );
};

export default UserTypeCard;
