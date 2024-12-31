"use server";

import { client } from "@/lib/prisma";

export const getAllOrganisations = async () => {
  try {
    const res = await client.organisation.findMany({
      include: {
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

export const getAllOrganisationsWithVolunteers = async () => {
  try {
    const res = await client.organisation.findMany({
      include: {
        volunteers: true,
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
}