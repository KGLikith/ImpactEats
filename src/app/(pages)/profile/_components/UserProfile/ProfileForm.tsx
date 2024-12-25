"use client";
import { EditUserProfileSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { updateUser } from "@/actions/user";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { UserType } from "../../page";

export type UserTypeInfo = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  website: string;
  description: string;
};

type Props = {
  user: UserType;
  userType: UserTypeInfo;
};

export default function ProfileForm({ user, userType }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof EditUserProfileSchema>>({
    mode: "onChange",
    resolver: zodResolver(EditUserProfileSchema),
    defaultValues: {
      name: userType.name || user.fullName || "",
      email: user.email || "",
      phone: userType.phone || "",
      type: user.type || "",
      address: userType.address || "",
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof EditUserProfileSchema>
  ) => {
    setIsLoading(true);
    console.log(values);
    const res = await updateUser(
      values,
      user.id,
      user.type,
      user.imageUrl || ""
    );
    if (!res) {
      setIsLoading(false);
      toast({
        description: "Something went wrong. Please try again",
        duration: 3000,
      });
      return;
    }
    toast({
      title: "Success",
      description: "User settings updated successfully",
      duration: 3000,
    });
    setIsLoading(false);
    await queryClient.invalidateQueries({
      queryKey: ["currentUser"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["currentUserType", user.id],
    });
  };

  // useEffect(() => {
  //   if (user)
  //     form.reset({
  //       name: user.fullName,
  //       email: user.email,
  //       type: user.type,
  //     });
  //   if (userType) {
  //     form.reset({
  //       name: userType.name,
  //       phone: userType.phone || "",
  //       address: userType.address || "",
  //     });
  //   }
  // }, [user, userType]);
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 flex-1"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          disabled={isLoading}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Full name*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={true}
                  placeholder="Email"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Phone*</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={true}
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Type</FormLabel>
              <FormControl>
                <Input {...field} placeholder="type" />
              </FormControl>
              <FormDescription className="text-black ml-2">
                You can always volunteer or donate.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Address*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Address" type="address" />
              </FormControl>
              <FormDescription className="text-black ml-2">
                Please provide your address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={cn("self-start hover:bg-[#2F006B] hover:text-white ")}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            "Save User Settings"
          )}
        </Button>
      </form>
    </Form>
  );
}
