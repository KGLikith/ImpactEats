"use server";
import { client } from "@/lib/prisma";

export const onDeleteImage = async (id: string, type: string) => {
  try {
    const response = await client.user.update({
      where: {
        id: id,
      },
      data: {
        imageUrl: "",
      },
    });
    if (type === "organisation") {
      await client.organisation.update({
        where: {
          userId: id,
        },
        data: {
          imageUrl: "",
        },
      });
    } else if (type === "Volunteer") {
      await client.volunteer.update({
        where: {
          userId: id,
        },
        data: {
          imageUrl: "",
        },
      });
    } else if (type === "Donor") {
      await client.donor.update({
        where: {
          userId: id,
        },
        data: {
          imageUrl: "",
        },
      });
    }
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const onUploadImage = async (
  id: string,
  imageUrl: string,
  type: string
) => {
  try {
    const response = await client.user.update({
      where: {
        id,
      },
      data: {
        imageUrl: imageUrl,
      },
    });
    console.log(type);
    if (type === "Organisation") {
      await client.organisation.update({
        where: {
          userId: id,
        },
        data: {
          imageUrl: imageUrl,
        },
      });
    } else if (type === "Volunteer") {
      await client.volunteer.update({
        where: {
          userId: id,
        },
        data: {
          imageUrl: imageUrl,
        },
      });
    } else if (type === "Donor") {
      await client.donor.update({
        where: {
          userId: id,
        },
        data: {
          imageUrl: imageUrl,
        },
      });
    }
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
};
