"use server";
import { client } from "@/lib/prisma";
import {
  EditorganizationProfileSchema,
  EditUserProfileSchema,
} from "@/schemas/auth.schema";
import { z } from "zod";

export const updateUser = async (
  value: z.infer<typeof EditUserProfileSchema>,
  id: string,
  type: string,
  imageUrl: string
) => {
  try {
    if (type === "Donor") {
      const res = await client.donor.upsert({
        where: {
          userId: id,
        },
        update: {
          name: value.name,
          phone: value.phone,
          address: value.address,
        },
        create: {
          name: value.name,
          phone: value.phone,
          address: value.address,
          imageUrl: imageUrl,
          userId: id,
        },
      });
      return res;
    }
    if (type === "Volunteer") {
      const res = await client.volunteer.upsert({
        where: {
          userId: id,
        },
        update: {
          name: value.name,
          phone: value.phone,
          address: value.address,
        },
        create: {
          name: value.name,
          phone: value.phone,
          address: value.address,
          imageUrl: imageUrl,
          userId: id,
        },
      });
      return res;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateOrganisation = async(
  values: z.infer<typeof EditorganizationProfileSchema>,
  id: string,
  imageUrl: string,
) => {
  try {
    const res = await client.organisation.upsert({
      where: {
        userId: id,
      },
      update: {
        name: values.name,
        phone: values.phone ?? '',
        address: values.address,
        website: values.website,
        imageUrl: imageUrl,
        description: values.description,
      },
      create: {
        name: values.name,
        email: values.email,
        phone: values.phone ?? '',
        address: values.address,
        website: values.website,
        description: values.description,
        imageUrl: imageUrl,
        userId: id,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }

};
