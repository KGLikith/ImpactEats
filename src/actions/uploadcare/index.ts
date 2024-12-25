"use server";
import { client } from "@/lib/prisma";

export const onDeleteImage = async (id: string) => {
  try {
    const response = await client.user.update({
      where: {
        id: id,
      },
      data: {
        imageUrl: "",
      },
    });
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const onUploadImage = async (id: string, imageUrl: string) => {
  try {
    const response = await client.user.update({
      where: {
        id,
      },
      data: {
        imageUrl: imageUrl,
      },
    });
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
};
