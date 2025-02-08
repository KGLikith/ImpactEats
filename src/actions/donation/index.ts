"use server";
import { client } from "@/lib/prisma";
import { DonationFormData } from "@/schemas/donation-form.schema";

export const createDonation = async (data: DonationFormData) => {
  try {
    const res = await client.donation.create({
      data: {
        description: data.description ? data.description : null,
        imageUrl: data.imageUrl,
        name: data.name,
        foodType: data.foodType,
        address: data.address,
        phone: data.phone,
        email: data.email,
        additionDeliveryNote: data.additionalDeliveryNote,
        quantity: data.quantity,
        quantityUnit: data.quantityUnit === "kg" ? "WEIGHT" : "PERSON",
        availableDate: data.availableDate,
        availableTime: data.availableTime,
        expiryDate: data.expiryDate,
        expiryTime: data.expiryTime,
        deliveryType: data.deliveryOption === "pickup" ? "PICKUP" : "SELF",
        donorId: data.donorId ? data.donorId : null,
        requestId: data.requestId ? data.requestId : null,
      },
      select: {
        id: true,
        donor: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!res?.donor?.userId) return { status: 400, data: null };
    await client.notification.create({
      data: {
        type: "Donation",
        userId: res.donor.userId,
        header: "New Donation",
        action: "Created",
        message:
          "You created a donation and is waiting to be claimed by an organisation",
        link: `/donations/${res.id}`,
        isRead: false,
      },
    });
    const organizations = await client.organisation.findMany({
      select: {
        id: true, // Ensure you fetch the organization's ID
        userId: true,
      },
    });
    client.notification
      .createMany({
        data: organizations.map((org) => ({
          type: "Donation",
          userId: org.userId,
          header: "New Donation",
          action: "Created",
          message: "A donation has been created. Would you like to claim it?",
          link: `/donations/${res.id}`,
          isRead: false,
        })),
      })
      .catch((err) => console.log(err));
    await client.history.create({
      data: {
        type: "Donation",
        userId: res.donor.userId,
        header: "Donation",
        action: "Created",
        donationId: res.id,
        description:
          data.quantityUnit === "kg"
            ? `You donated a ${data.name} of ${data.quantity} kg`
            : `You donated a ${data.name} for ${data.quantity} people`,
        message:
          "You created a donation and is waiting to be claimed by an organisation",
        timing: `Donation form submitted on ${new Date().toLocaleString()}. \n `,
        link: `/donations/${res.id}`,
      },
    });
    return { status: 200, data: res };
  } catch (err) {
    console.log("error in creating donation", (err as Error).message);
    return { status: 500, data: null };
  }
};

export const getDonationDetails = async (id: string) => {
  try {
    const data = await client.donation.findUnique({
      where: {
        id: id,
      },
      include: {
        donor: true,
        claim: {
          select: {
            id: true,
            status: true,
            organisationId: true,
            createdAt: true,
            organisation: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                email: true,
                phone: true,
                address: true,
                volunteers: true,
              },
            },
            task: {
              select: {
                id: true,
                status: true,
                volunteerId: true,
                volunteer: {
                  select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                    email: true,
                    phone: true,
                  },
                },
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
    console.log(data);
    if (!data) return { status: 404, data: [] };
    return { status: 200, data: data };
  } catch (err) {
    console.log("error in getting donation details", (err as Error).message);
    return { status: 500, data: null };
  }
};

export const getAllDonations = async () => {
  try {
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toLocaleDateString().split("T")[0];
    const currentTime = currentDateTime.toLocaleTimeString().slice(0, 5);
    console.log(currentDate, currentTime);
    const data = await client.donation.findMany({
      where: {
        status: "PENDING",
        // AND: [
        //   {
        //     OR: [
        //       {
        //         expiryDate: {
        //           lt: currentDate,
        //         },
        //       },
        //       {
        //         AND: [
        //           { expiryDate: currentDate },
        //           { expiryTime: { lt: currentTime } },
        //         ],
        //       },
        //     ],
        //   },
        // ],
      },
      include: {
        donor: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    console.log(data);
    return { status: 200, data: data };
  } catch (err) {
    console.log(err);
    return { status: 500, data: null };
  }
};

export const handleClaimDonation = async (
  donationId: string,
  organisationId: string
) => {
  try {
    const res = await client.claim.create({
      data: {
        status: "CLAIMED",
        donationId: donationId,
        organisationId: organisationId,
      },
      select: {
        organisation: {
          select: {
            name: true,
            userId: true,
            volunteers: {
              select: {
                userId: true,
                id: true,
              },
            },
          },
        },
        donation: {
          select: {
            donor: {
              select: {
                name: true,
                userId: true,
              },
            },
          },
        },
      },
    });
    await client.donation.update({
      where: {
        id: donationId,
      },
      data: {
        status: "CLAIMED",
      },
    });
    await client.notification.create({
      data: {
        type: "Donation",
        userId: res.organisation.userId,
        header: "New Claim",
        action: "Claimed",
        message:
          "You claimed a donation and is waiting for the volunteer to accept",
        link: `/donations/${donationId}`,
        isRead: false,
      },
    });
    await client.notification.createMany({
      data: res.organisation.volunteers.map((volunteer) => ({
        type: "Donation",
        userId: volunteer.userId,
        header: "New Claim",
        action: "Claimed",
        message:
          "A donation has been claimed by an organisation and is waiting for a volunteer to accept",
        link: `/donations/${donationId}`,
        isRead: false,
      })),
    });
    await client.history.create({
      data: {
        type: "Donation",
        userId: res.organisation.userId,
        header: "Donation",
        action: "Claimed",
        donationId: donationId,
        description: `You claimed a donation from ${
          res.donation.donor?.name ?? "unknown donor"
        }`,
        message:
          "You claimed a donation and is waiting for the volunteer to accept",
        timing: `Claimed on ${new Date().toLocaleString()}. \n `,
        link: `/donations/${donationId}`,
      },
    });
    if (res.donation.donor?.userId) {
      await client.notification.create({
        data: {
          type: "Donation",
          userId: res.donation.donor.userId,
          header: "Donation Claimed",
          action: "Claimed",
          message: `Your donation has been claimed by ${res.organisation?.name}`,
          link: `/donations/${donationId}`,
          isRead: false,
        },
      });
      const history = await client.history.findFirst({
        where: {
          AND: [
            { userId: res.donation.donor.userId },
            { donationId: donationId },
          ],
        },
      });
      await client.history.update({
        where: {
          id: history?.id,
        },
        data: {
          action: "Claimed",
          message: `Your donation has been claimed by ${res.organisation?.name}`,
          timing: `${
            history?.timing || ""
          } Claimed on ${new Date().toLocaleString()}.\n`,
        },
      });
      console.log("notification sent to donor");
    }
    console.log(res);
    return res;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const handleVolunteerForDonation = async (
  donationId: string,
  volunteerId: string,
  claimId: string
) => {
  console.log(donationId, volunteerId, claimId);
  try {
    const res = await client.task.create({
      data: {
        status: "PENDING",
        volunteerId: volunteerId,
        claimId: claimId,
      },
      select: {
        volunteer: {
          select: {
            name: true,
            userId: true,
          },
        },
        Claim: {
          select: {
            organisation: {
              select: {
                name: true,
                userId: true,
              },
            },
            donation: {
              select: {
                name: true,
                id: true,
                donor: {
                  select: {
                    name: true,
                    userId: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    await client.claim.update({
      where: {
        id: claimId,
      },
      data: {
        status: "ASSIGNED",
      },
    });
    await client.notification.create({
      data: {
        type: "Volunteering",
        userId: res.volunteer.userId,
        header: "New Task",
        action: "Assigned",
        message: "You started volunteering for a donation",
        link: `/donations/${donationId}`,
        isRead: false,
      },
    });
    await client.notification.create({
      data: {
        type: "Volunteering",
        userId: res.Claim.organisation.userId,
        header: "Task Assigned",
        action: "Assigned",
        message: `${res.volunteer.name} started volunteering for one of your claims `,
        link: `/donations/${donationId}`,
        isRead: false,
      },
    });
    await client.notification.create({
      data: {
        type: "Volunteering",
        userId: res.Claim.donation.donor?.userId ?? "",
        header: "Task Assigned",
        action: "Assigned",
        message: `${res.volunteer.name} started volunteering for one of your donations `,
        link: `/donations/${donationId}`,
        isRead: false,
      },
    });
    await client.history.create({
      data: {
        type: "Donation",
        userId: res.volunteer.userId,
        header: "New Task",
        action: "Volunteering",
        donationId: donationId,
        description: "You started volunteering for a donation",
        message:
          "You started volunteering for a donation and is waiting for the pickup",
        timing: `Volunteering started on ${new Date().toLocaleString()}. \n `,
        link: `/donations/${donationId}`,
      },
    });
    const orgnaisationHistory = await client.history.findFirst({
      where: {
        AND: [
          { userId: res.Claim.organisation.userId },
          { donationId: donationId },
        ],
      },
    });
    await client.history.update({
      where: {
        id: orgnaisationHistory?.id,
      },
      data: {
        action: "Assigned",
        message: `${res.volunteer.name} started volunteering for this claim`,
        timing: `${
          orgnaisationHistory?.timing || ""
        } Assigned on ${new Date().toLocaleString()}.\n`,
      },
    });
    const donorHistory = await client.history.findFirst({
      where: {
        AND: [
          { userId: res.Claim.donation.donor?.userId ?? "" },
          { donationId: donationId },
        ],
      },
    });
    await client.history.update({
      where: {
        id: donorHistory?.id,
      },
      data: {
        action: "Assigned",
        message: `${res.volunteer.name} started volunteering for this donations`,
        timing: `${
          donorHistory?.timing || ""
        } Assigned on ${new Date().toLocaleString()}.\n`,
      },
    });
    return res;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
