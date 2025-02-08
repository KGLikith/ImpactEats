"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { UserTypeInfo } from "@/schemas/user.schema";
import UploadCareButton from "../../profile/_components/UploadCareButton";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { uploadcareLoader } from "@uploadcare/nextjs-loader";
import { useDonationContextHook } from "@/context/user-donation";
import { useFormContext } from "react-hook-form";
import React, { useCallback, useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";

type Props = {
  type: "donation" | "request";
  donor: UserTypeInfo;
  requestId?: string;
  userType: "Donor" | "Volunteer" | "Organisation";
};

export default function DonationForm({
  type,
  donor,
  userType,
  requestId,
}: Props) {
  const { setCurrentStep } = useDonationContextHook();
  const [error, setError] = React.useState<string | null>(null);
  const form = useFormContext();

  useEffect(() => {
    form.setValue("address", form.getValues("address") || donor.address);
    form.setValue("name", form.getValues("name"));
    form.setValue("email", form.getValues("email") || donor.email);
    form.setValue("phone", form.getValues("phone") || donor.phone);
    form.setValue("type", form.getValues("type") || type);
    form.setValue("userType", form.getValues("userType") || userType);
    form.setValue("donorId", form.getValues("donorId") || donor.id);
    form.setValue("requestId", form.getValues("requestId") || requestId);
    form.setValue("quantity", form.getValues("quantity") || 1);
    form.setValue("quantityUnit", form.getValues("quantityUnit") || "kg");
  }, []);

  const {
    formState: { errors,touchedFields },
  } = form;

  const quantityUnit = form.watch("quantityUnit");
  return (
    <>
      <div className="flex w-full  items-center">
        <h1 className="font-extrabold text-xl">Food Information</h1>
      </div>
      <div className="flex gap-2 w-full h-auto">
        <div className="flex flex-col gap-2 flex-1">
          <FormField
            name="foodType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Food Type*</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select food type"
                        defaultValue={field.value}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RAW">RAW</SelectItem>
                      <SelectItem value="COOKED">COOKED</SelectItem>
                      <SelectItem value="PACKAGED">PACKAGED</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>
                  {errors.foodType?.message?.toString()}
                </FormMessage>
              </FormItem>
            )}
          />
          <div className="flex gap-2 w-full">
            <FormField
              name="quantity"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-2/3">
                  <FormLabel className="text-base">Quantity*</FormLabel>
                  <FormControl>
                    <Input
                      id="quantity"
                      {...field}
                      min={1}
                      type="number"
                      className="mt-1"
                    />
                  </FormControl>
                  <p className="text-sm text-gray-500">
                    {quantityUnit === "person"
                      ? "People it will feed"
                      : "Kilograms of food"}
                  </p>
                  <FormMessage>
                    {errors.description?.message?.toString()}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              name="quantityUnit"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel className="text-base">Food Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || "kg"}
                      value={field.value || "kg"}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select unit"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">KG</SelectItem>
                        <SelectItem value="person">PEOPLE</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>
                    {errors.quantityType?.message?.toString()}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-2/3">
                <FormLabel className="text-base">Name*</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    {...field}
                    className="mt-1"
                  />
                </FormControl>
                <p className="text-sm text-gray-500">
                  Please provide a name for the food you are donating
                </p>
                <FormMessage>
                  {errors.description?.message?.toString()}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Description</FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    rows={1}
                    {...field}
                    className="mt-1 md:text-base"
                  />
                </FormControl>
                <p className="text-sm text-gray-500">
                  Please provide the description of the food you are
                  donating(Small descripiton would be helpful)
                </p>
                <FormMessage>
                  {touchedFields[field.name] &&
                    errors.foodType?.message?.toString()}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="flex-1 flex justify-center items-center w-full h-auto">
          <FormField
            name="imageUrl"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full h-full flex flex-col justify-start gap-4 items-center">
                <FormLabel className="text-base">Upload Image</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center justify-center space-y-4 w-full h-full">
                    {field.value ? (
                      <>
                        <div className="relative w-3/4 h-full overflow-hidden rounded-lg">
                          <Image
                            src={field.value}
                            alt="Food Image"
                            loader={uploadcareLoader}
                            layout="fill"
                            objectFit="fill"
                          />
                        </div>
                        <Button
                          onClick={() => {
                            field.onChange("");
                          }}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Remove Picture</span>
                        </Button>
                      </>
                    ) : (
                      <div className="w-full max-w-xs h-full justify-center items-center flex flex-col">
                        <UploadCareButton
                          onUpload={(url) => field.onChange(url)}
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex w-full  items-center">
        <h1 className="font-extrabold text-xl">Contact Information</h1>
      </div>
      <FormField
        name="address"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Address*</FormLabel>
            <FormControl>
              <Textarea id="address" {...field} className="mt-1" />
            </FormControl>
            <ErrorMessage
              errors={errors}
              name={field.name}
              render={({ message }) => (
                <p className="text-red-400 mt-2">
                  {message === "Required" ? "" : message}
                </p>
              )}
            />
          </FormItem>
        )}
      />

      <FormField
        name="email"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Email*</FormLabel>
            <FormControl>
              <Input id="email" type="email" {...field} className="mt-1" />
            </FormControl>
            <FormMessage>{errors.email?.message?.toString()}</FormMessage>
          </FormItem>
        )}
      />

      <FormField
        name="phone"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Phone Number*</FormLabel>
            <FormControl>
              <Input id="phone" type="tel" {...field} className="mt-1" />
            </FormControl>
            <FormMessage>{errors.phone?.message?.toString()}</FormMessage>
          </FormItem>
        )}
      />
      <p>
        <span className="text-red-500 text-base">{error}</span>
      </p>
      <div className="flex justify-end items-center">
        <Button
          onClick={useCallback(() => {
            const touchedFieldNames = [
              "foodType",
              "description",
              "quantity",
              "quantityUnit",
              "address",
              "email",
              "phone",
              "name"
            ];
            form.trigger(touchedFieldNames as any).then((isValid) => {
              if (isValid) {
                setError("");
                setCurrentStep(2);
              } else {
                setError("Please fill all the required fields");
              }
            });
          }, [form, setCurrentStep])}
          disabled={form.formState.isSubmitting}
          className="w-1/4  bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Next
        </Button>
      </div>
    </>
  );
}
