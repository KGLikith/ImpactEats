"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDonationContextHook } from "@/context/user-donation";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

export default function DeliveryInfo() {
  const {  setCurrentStep } = useDonationContextHook();
  const form = useFormContext();

  useEffect(()=>{
    form.clearErrors()
  },[])

  const {
    formState: { errors },
  } = form;
  return (
    <>
      <div className="flex  gap-4 items-center">
        <FormField
          name="availableDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Date</FormLabel>
              <FormControl>
                <Input
                  id="availableDate"
                  type="date"
                  {...field}
                  className="mt-1"
                />
              </FormControl>
              <FormMessage>
                {form.formState.touchedFields[field.name] &&
                  errors.foodType?.message?.toString()}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          name="availableTime"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Time</FormLabel>
              <FormControl>
                <Input
                  id="availableTime"
                  type="time"
                  {...field}
                  className="mt-1"
                />
              </FormControl>
              <FormMessage>
                {errors.availableTime?.message?.toString()}
              </FormMessage>
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4 items-center">
        <FormField
          name="expiryDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input
                  id="expiryDate"
                  type="date"
                  {...field}
                  className="mt-1"
                />
              </FormControl>
              <FormMessage>
                {errors.expiryDate?.message?.toString()}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          name="expiryTime"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Time</FormLabel>
              <FormControl>
                <Input
                  id="expiryTime"
                  type="time"
                  {...field}
                  className="mt-1"
                />
              </FormControl>
              <FormMessage>
                {errors.expiryTime?.message?.toString()}
              </FormMessage>
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="deliveryOption"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Delivery Option</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">Pickup</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="self-delivery" id="self-delivery" />
                  <Label htmlFor="self-delivery">Deliver it Yourself</Label>
                </div>
              </RadioGroup>
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
        name="additionalDeliveryNote"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Delivery Note</FormLabel>
            <FormControl>
              <Textarea
                id="additionalDeliveryNote"
                rows={2}
                {...field}
                className="mt-1 md:text-base"
              />
            </FormControl>
            <p className="text-sm text-gray-500">
              Add a delivery note to the recipient
            </p>
            <FormMessage>
              {errors.additionalDeliveryNote?.message?.toString()}
            </FormMessage>
          </FormItem>
        )}
      />
      <div className="flex justify-between items-center ">
        <Button
          onClick={() => setCurrentStep(1)}
          className="w-1/4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Previous
        </Button>
        <Button
          type="submit"
          className="w-1/4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Next
        </Button>
      </div>
    </>
  );
}
