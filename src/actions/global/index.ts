"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

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
};

export const getUserTypeWithVolunteers = async () => {
  try {
    const currentuser = await currentUser();
    if (!currentuser) return { status: 401, data: [] };
    const user = await client.user.findUnique({
      where: {
        clerkId: currentuser.id,
      },
    });
    if (!user) return null;

    if (user.type === "Organisation") {
      const userType = await client.organisation.findUnique({
        where: {
          userId: user.id,
        },
      });
      if (userType) return { status: 200, data: userType };
    } else if (user.type === "Volunteer") {
      const userType = await getVolunteerInfobyUserId(user.id);

      if (userType)
        return { status: 200, data: { ...userType.data, type: user.type } };
    } else if (user.type === "Donor") {
      const userType = await getDonorInfoByUserId(user.id);
      if (userType)
        return { status: 200, data: { ...userType.data, type: user.type } };
    }

    return { status: 400, data: [] };
  } catch (err) {
    console.log("error in fetching user type", err);
    return { status: 500, data: [] };
  }
};

export const getVolunteerInfobyUserId = async (id: string) => {
  try {
    const res = await client.volunteer.findUnique({
      where: { userId: id },
      include: {
        organisations: {
          select: {
            id: true,
          },
        },
      },
    });
    return { status: 200, data: res };
  } catch (err) {
    console.log("error in fetching volunteer info", err);
    return { status: 500, data: null };
  }
};
export const getVolunteerInfo = async (id: string) => {
  try {
    const res = await client.volunteer.findUnique({
      where: { id: id },
      include: {
        task: {
          include: {
            Claim: {
              include: {
                donation: true,
                organisation: true,
              },
            },
          },
        },
        organisations: true,
        _count: {
          select: {
            task: {
              where:{
                status: 'COMPLETED'
              }
            },
            organisations: true,
          },
        },
      },
    });
    return { status: 200, data: res };
  } catch (err) {
    console.log("error in fetching volunteer info", err);
    return { status: 500, data: null };
  }
};

export const getDonorInfoByUserId = async (id: string) => {
  try {
    const res = await client.donor.findUnique({
      where: { userId: id },
    });
    return { status: 200, data: res };
  } catch (err) {
    console.log("error in fetching donor info", err);
    return { status: 500, data: null };
  }
};

export const getDonorInfo = async (id: string) => {
  try {
    const res = await client.donor.findUnique({
      where: { id },
      include: {
        donations: {
          include: {
            claim: {
              include: {
                organisation: true,
              },
            },
          },
        },
        _count: {
          select: {
            donations:{
              where:{
                status: 'COMPLETED'
              }
            }
          },
        },
      },
    });
    return { status: 200, data: res };
  } catch (err) {
    console.log("error in fetching donor info", err);
    return { status: 500, data: null };
  }
};
