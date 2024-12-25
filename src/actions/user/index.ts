"use server";
import { client } from "@/lib/prisma";
import { EditUserProfileSchema } from "@/schemas/auth.schema";
import { z } from "zod";

export const updateUser = async (
  value: z.infer<typeof EditUserProfileSchema>,
  id: string,
  type: string,
  imageUrl: string,
) => {
  console.log(value);
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
