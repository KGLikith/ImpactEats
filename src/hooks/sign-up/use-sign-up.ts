"use client";
import {
  UserRegistrationProps,
  UserRegistrationSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { onCompleteUserRegistration } from "@/actions/auth";
import { useToast } from "../use-toast";
import { z } from "zod";

export const useSignUpForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();
  const methods = useForm<z.infer<typeof UserRegistrationSchema>>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      type: "Donor",
    },
    mode: "onChange",
  });

  const onGenerateOTP = async (
    email: string,
    password: string,
    onNext: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: email,
        password: password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      onNext((prev) => prev + 1);
    } catch (error: any) {
      console.log(error.errors[0].longMessage);
      toast({
        title: "Error",
        variant: "destructive", 
        description: error.errors[0].longMessage,
        duration: 3000,
      });
    }
  };

  const onHandleSubmit = methods.handleSubmit(
    async (values: UserRegistrationProps) => {
      if (!isLoaded) return;

      try {
        setLoading(true);
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: values.otp,
        });

        if (completeSignUp.status !== "complete") {
          return { message: "Something went wrong!" };
        }

        if (completeSignUp.status == "complete") {
          if (!signUp.createdUserId) return;
          const registered = await onCompleteUserRegistration(
            values.fullname,
            signUp.createdUserId,
            values.email,
            values.type
          );

          if (registered?.status == 200 && registered.user) {
            await setActive({
              session: completeSignUp.createdSessionId,
            });

            setLoading(false);
            router.push("/dashboard");
          }

          if (registered?.status == 400) {
            toast({
              title: "Error",
              description: "Something went wrong!",
            });
          }
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.errors[0].longMessage,
        });
      }
    }
  );
  return {
    methods,
    onHandleSubmit,
    onGenerateOTP,
    loading,
  };
};
