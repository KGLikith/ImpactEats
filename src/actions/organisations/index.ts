"use server";
import { client } from "@/lib/prisma";

export const getOrganisationById = async (id: string) => {
  try {
    const organisation = await client.organisation.findUnique({
      where: { id },
      include: {
        request: {
          where: {
            status: "PENDING",
          },
        },
        volunteers: true,
        _count: {
          select: {
            claims: true,
            volunteers: true,
          },
        },
      },
    });
    if (!organisation) return { status: 404, data: null };
    const pendingClaims = await client.claim.findMany({
      where: {
        organisationId: id,
        OR: [{ status: "CLAIMED" }, { status: "ASSIGNED" }],
      },
      select: {
        id: true,
        status: true,
        donationId: true,
        donation: {
          select: {
            name: true,
            foodType: true,
            description: true,
            quantity: true,
            quantityUnit: true,
            status: true,
            availableDate: true,
            availableTime: true,
            expiryDate: true,
            expiryTime: true,
          },
        },
      },
    });
    const completedClaims = await client.claim.findMany({
      where: { organisationId: id, status: "RECIEVED" },
      select: {
        id: true,
        status: true,
        donationId: true,
        donation: {
          select: {
            name: true,
            foodType: true,
            description: true,
            quantity: true,
            quantityUnit: true,
            status: true,
          },
        },
      },
    });
    return { status: 200, data: organisation, pendingClaims, completedClaims };
  } catch (err) {
    console.log("error in fetching organisation", err);
    return { status: 500, data: null };
  }
};

export const getClaims = async (organisationId: string) => {
  try {
    const claims = await client.claim.findMany({
      where: { organisationId },
      include: {
        donation: {
          select: {
            id: true,
            name: true,
            foodType: true,
            description: true,
            quantity: true,
            quantityUnit: true,
            status: true,
            availableDate: true,
            availableTime: true,
            expiryDate: true,
            expiryTime: true,
            deliveryOption: true,
            deliveryType: true,
            donor: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        task: {
          include: {
            volunteer: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(claims);
    return { status: 200, data: claims };
  } catch (err) {
    console.log("error in fetching claims", err);
    return { status: 500, data: null };
  }
};

export const getVolunteers = async (organisationId: string) => {
  try {
    const volunteers = await client.organisation.findUnique({
      where: { id: organisationId },
      select: {
        volunteers: true,
      },
    });
    if (!volunteers) return { status: 404, volunteers: [] };
    return { status: 200, volunteers: volunteers.volunteers };
  } catch (err) {
    console.log("error in fetching volunteers", err);
    return { status: 500, volunteers: [] };
  }
};

export const addVolunteer = async (orgId: string, volId: string) => {
  try {
    const organisation = await client.organisation.update({
      where: { id: orgId },
      data: {
        volunteers: {
          connect: {
            id: volId,
          },
        },
      },
    });
    const volunteer = await client.volunteer.findUnique({
      where: { id: volId },
    });
    if (!volunteer || !organisation) return { status: 404, data: null };
    await client.notification.create({
      data: {
        userId: volunteer.userId,
        type: "VOLUNTEER",
        header: "Volunteering",
        action: "COMPLETED",
        message: `Thank you for volunteering for ${organisation.name}.\n
        All the updates from this organisation are notified to you.`,
        link: `/organisations/${orgId}`,
      },
    });
    await client.notification.create({
      data: {
        userId: organisation.userId,
        type: "VOLUNTEER",
        header: "Volunteering",
        action: "COMPLETED",
        message: `${volunteer.name} started volunteering for your organisation.\n
        All the updates are notified to the volunteer.`,
        link: `/volunteers`,
      },
    });

    await client.history.create({
      data: {
        userId: volunteer?.userId,
        type: "VOLUNTEER",
        action: "VOLUNTEERED",
        header: "Volunteering",
        message: `You started volunteering for ${organisation.name}`,
        link: `/organisations/${orgId}`,
      },
    });
    await client.history.create({
      data: {
        userId: organisation?.userId,
        type: "VOLUNTEER",
        action: "VOLUNTEERED",
        header: "Volunteering",
        message: `${volunteer.name} started volunteering for your organisation`,
        // link: `/volunteers`,
      },
    });
    return { status: 200, data: organisation };
  } catch (err) {
    console.log("error in adding volunteer", err);
    return { status: 500, data: null };
  }
};
