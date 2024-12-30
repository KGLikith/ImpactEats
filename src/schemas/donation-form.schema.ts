import { z } from "zod";

export const donationSchema = z
  .object({
    foodType: z.enum(["RAW", "COOKED", "PACKAGED"], {
      message: "Please select a food type",
    }),
    name: z.string().min(3, { message: "Name must be at least 3 character" }),
    description: z.string().optional(),
    imageUrl: z.any().optional(),
    type: z.enum(["donation", "request"]).default("donation"),
    address: z
      .string()
      .min(5, { message: "Address must be at least 5 characters" }),
    additionalDeliveryNote: z.string().optional(),
    quantity: z.coerce
      .number()
      .int()
      .min(1, { message: "Quantity must be at least 1" })
      .default(1),
    quantityUnit: z.enum(["kg", "person"]).default("kg"),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" }),
    availableDate: z.string().refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()); // Ensure valid date
    }, "Invalid available date"),
    expiryDate: z.string().refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()); // Ensure valid date
    }, "Invalid expiry date"),
    availableTime: z
      .string()
      .min(1, { message: "Please select an available time" }),
    expiryTime: z
      .string()
      .min(1, { message: "Please select an available time" }),
    deliveryOption: z
      .enum(["pickup", "self-delivery"], {
        message: "Please select a delivery option",
      })
      .default("pickup"),
    donorId: z.string().optional(),
    organisationId: z.string().optional(),
    volunteerId: z.string().optional(),
    userType: z.enum(["Donor", "Volunteer", "Organisation"]).default("Donor"),
    requestId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const availableDateTime = new Date(
      `${data.availableDate}T${data.availableTime}`
    );
    const expiryDateTime = new Date(`${data.expiryDate}T${data.expiryTime}`);

    if (expiryDateTime < availableDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiryDate"], // Specify which field the error belongs to
        message: "Expiry cannot be before the available date.",
      });
    }
  });

export type DonationType = {
  foodType: "RAW" | "COOKED" | "PACKAGED";
  description?: string;
  name: string;
  imageUrl?: any;
  type: "donation" | "request";
  address: string;
  additionalDeliveryNote?: string;
  quantity: number;
  quantityUnit: "kg" | "person" | "WEIGHT" | "PERSON";
  email: string;
  phone: string;
  availableDate: string;
  availableTime: string;
  expiryDate: string;
  expiryTime: string;
  deliveryOption: "pickup" | "self-delivery";
  donorId?: string;
  organisationId?: string;
  userType: "donor" | "volunteer" | "organisation";
  requestId?: string;
  deliveryType?: "PICKUP" | "SELF";
};

export type DonationFormData = z.infer<typeof donationSchema>;

export type DefaultOptions = {
  foodType?: "RAW" | "COOKED" | "PACKAGED";
  description?: string;
  imageUrl?: any;
  address?: string;
  name?: string;
  additionDeliveryNote?: string;
  quantity?: number;
  type: "donation" | "request";
  userType: "donor" | "volunteer" | "organisation";
  quantityUnit?: "kg" | "person";
  email?: string;
  phone?: string;
  availableDate?: string;
  availableTime?: string;
  expiryDate?: string;
  expiryTime?: string;
  organisationId?: string;
  deliveryOption?: "pickup" | "self-delivery";
  donorId?: string;
  requestId?: string;
  volunteerId?: string;
};
