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
    });
    let user;
    if (data.userType === "Donor") {
      console.log(data.donorId);
      user = await client.donor.findUnique({
        where: {
          id: data.donorId,
        },
        select: {
          id: true,
          userId: true,
        },
      });
    }
    if (!user?.userId) return { status: 400, data: null };

    await client.notification.create({
      data: {
        type: "Donation",
        userId: user.userId,
        header: "New Donation",
        action: "Created",
        message:
          "You created a donation and is waiting to be claimed by an organisation",
        link: `/donation/${res.id}`,
        isRead: false,
      },
    });
    await client.history.create({
      data: {
        type: "Donation",
        userId: user.userId,
        header: "Donation",
        action: "Created",
        donationId: res.id,
        description:
          data.quantityUnit === "kg"
            ? `You donated a ${data.name} of ${data.quantity} kg`
            : `You donated a ${data.name} for ${data.quantity} people`,
        message:
          "You created a donation and is waiting to be claimed by an organisation",
        timing: `Donation form submitted on ${new Date().toLocaleString()} \n `,
        link: `/donation/${res.id}`,
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
        donor: {
          isNot: null,
        },
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
    if (!data) return { status: 404, data: null };
    return { status: 200, data: data };
  } catch (err) {
    console.log("error in getting donation details", (err as Error).message);
    return { status: 500, data: null };
  }
};
