"use server";

import { client } from "@/lib/prisma";

export const getAllOrganisations = async () => {
  try {
    const res = await client.organisation.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        website: true,
        imageUrl: true,
        createdAt: true,
        description: true,
        _count: {
          select: {
            volunteers: true,
            claims: true,
          },
        },
      },
    });
    return { status: 200, data: res };
  } catch (err) {
    console.log("error in fetching organisations", err);
    return { status: 500, data: [] };
  }
};

export const getOrganisationById = async (id: string) => {
  try {
    const res = await client.organisation.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        website: true,
        imageUrl: true,
        description: true,
        _count: {
          select: {
            claims: true,
            volunteers: true,
          },
        },
      },
    });
    return { status: 200, data: res };
  } catch (err) {
    console.log("error in fetching organisation", err);
    return { status: 500, data: null };
  }
};

export const deleteNotification = async (id: string) => {
  try {
    const res = await client.notification.delete({
      where: { id },
    });
    return { status: 200, data: res };
  } catch (err) {
    console.log("error in deleting notification", err);
    return { status: 500, data: null };
  }
};
export const deleteAllUserNotifications = async (userId: string) => {
  try {
    const res = await client.notification.deleteMany({
      where: { userId },
    });
    return { status: 200, data: res };
  } catch (err) {
    console.log("error in deleting all notifications", err);
    return { status: 500, data: null };
  }
};
