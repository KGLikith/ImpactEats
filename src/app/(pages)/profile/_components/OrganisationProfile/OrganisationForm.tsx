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
import { UserTypeInfo } from "../UserProfile/ProfileForm";

type Props={
  organisation: UserTypeInfo
}

export default function OrganisationForm({organisation}:Props) {
  return (
    <div>OrganisationForm</div>
  )
}