"use client";
import {
  EditorganizationProfileSchema,
  EditUserProfileSchema,
} from "@/schemas/auth.schema";
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
import { updateOrganisation, updateUser } from "@/actions/user";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { UserType } from "../../page";
import { UserTypeInfo } from "../UserProfile/ProfileForm";

type Props = {
  organisation: UserTypeInfo;
  user: UserType;
};

export default function OrganisationForm({ organisation, user }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof EditorganizationProfileSchema>>({
    mode: "onChange",
    resolver: zodResolver(EditorganizationProfileSchema),
    defaultValues: {
      name: organisation.name || user.fullName || "",
      email: organisation.email || "",
      phone: organisation.phone || "",
      address: organisation.address || "",
      website: organisation.website || "",
      description: organisation.description || "",
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof EditorganizationProfileSchema>
  ) => {
    setIsLoading(true);
    const res = await updateOrganisation(values, user.id, user.imageUrl || "");
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
      description: "Organisation profile updated successfully",
      duration: 3000,
    });
    setIsLoading(false);
    await queryClient.invalidateQueries({
      queryKey: ["currentUserType", user.id],
    });
  };

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
              <FormLabel className="text-lg">Organisation name*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Name" />
              </FormControl>
              <FormDescription className="text-black ml-2">
                Please provide your organisation name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Organisation Email*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email" type="email" />
              </FormControl>
              <FormDescription className="text-black ml-2">
                If no organisation email, please provide your email
              </FormDescription>
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
                <Input placeholder="Phone" {...field} type="phone" />
              </FormControl>
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
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Webiste Url</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Website URL" type="website" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Description"
                  type="description"
                />
              </FormControl>
              <FormDescription className="text-black ml-2">
                Please provide a description of what you do
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
            "Save Organisation Settings"
          )}
        </Button>
      </form>
    </Form>
  );
}
