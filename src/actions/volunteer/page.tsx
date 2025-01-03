"use server";

import { client } from "@/lib/prisma";

export const updateTaskStatus = async (taskId: string, status: string) => {
  console.log(taskId, status);
  try {
    const task = await client.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: status as "PENDING" | "RECIEVED" | "CANCELLED" | "COMPLETED",
      },
      select: {
        Claim: {
          select: {
            id: true,
            organisation: {
              select: {
                id: true,
                userId: true,
              },
            },
            donation: {
              select: {
                id: true,
                donor: {
                  select: {
                    id: true,
                    userId: true,
                  },
                },
              },
            },
          },
        },
        volunteerId: true,
      },
    });
    console.log("hello");

    if (status === "COMPLETED") {
      console.log(task.Claim.id);
      await client.claim.update({
        where: {
          id: task.Claim.id,
        },
        data: {
          status: "RECIEVED",
        },
      });

      await client.donation.update({
        where: {
          id: task.Claim.donation.id,
        },
        data: {
          status: "COMPLETED",
        },
      });

      await client.notification.create({
        data: {
          userId: task.Claim.donation.donor?.userId || "",
          header: "Donation Recieved",
          action: "Completed",
          message: "Your donation has been recieved.Thank you for your help",
          type: "Donation",
          link: `/donation/${task.Claim.donation.donor?.id}`,
        },
      });

      await client.notification.create({
        data: {
          userId: task.Claim.organisation.userId,
          header: "Donation Recieved",
          action: "Completed",
          message: "Your claim has been delivered by your volunteer",
          type: "Donation",
          link: `/donation/${task.Claim.donation.donor?.id}`,
        },
      });

      const donorHistory = await client.history.findFirst({
        where: {
          userId: task.Claim.donation.donor?.userId || "",
          donationId: task.Claim.donation.id || "",
        },
      });

      if (donorHistory) {
        await client.history.update({
          where: {
            id: donorHistory.id,
          },
          data: {
            action: `COMPLETED`,
            message: `Your donation has been recieved.Thank you for your help`,
            timing: `${
              donorHistory.timing
            } Delivery Status updated to COMPLETED at ${new Date().toLocaleString()}.`,
          },
        });
      }

      const volunteerHistory = await client.history.findFirst({
        where: {
          userId: task.volunteerId,
          donationId: task.Claim.donation.id || "",
        },
      });

      if (volunteerHistory) {
        const volu = await client.history.update({
          where: {
            id: volunteerHistory.id,
          },
          data: {
            action: `COMPLETED`,
            message: `The donation has been completed and recieved by the donor`,
            timing: `${
              volunteerHistory.timing
            } Delivery is completed at ${new Date().toLocaleString()}.`,
          },
        });
        console.log("vol", volu);
      }

      const orgHistory = await client.history.findFirst({
        where: {
          userId: task.Claim.organisation.userId,
          donationId: task.Claim.donation.id || "",
        },
      });

      if (orgHistory) {
        await client.history.update({
          where: {
            id: orgHistory.id,
          },
          data: {
            action: `COMPLETED`,
            message: `The donation has been completed`,
            timing: `${
              orgHistory.timing
            },Delivery completed at ${new Date().toLocaleString()}.`,
          },
        });
      }
    }

    if (task.Claim.donation.donor) {
      await client.notification.create({
        data: {
          userId: task.Claim.organisation.userId,
          header: "Task Status Updated",
          action: "Pending",
          message: `Task status has been updated to ${status}`,
          type: "Volunteering",
          link: task.Claim.donation.donor
            ? `/donation/${task.Claim.donation.donor.id}`
            : "#",
        },
      });
      await client.notification.create({
        data: {
          userId: task.Claim.donation.donor.userId,
          header: "Task Status Updated",
          action: "Pending",
          message: `Task status has been updated to ${status} for one of your doantions`,
          type: "Volunteering",
          link: `/donation/${task.Claim.donation.donor.id}`,
        },
      });
      await client.notification.create({
        data: {
          userId: task.Claim.organisation.userId,
          header: "Task Status Updated",
          action: "Pending",
          message: `Task status has been updated to ${status} for one of your claims`,
          type: "Volunteering",
          link: `/donation/${task.Claim.donation.donor.id}`,
        },
      });

      const donorHistory = await client.history.findFirst({
        where: {
          userId: task.Claim.donation.donor.userId,
          donationId: task.Claim.donation.id,
        },
      });
      console.log("donorHistory", donorHistory);
      if (donorHistory) {
        await client.history.update({
          where: {
            id: donorHistory.id,
          },
          data: {
            action: `Task status updated to ${status}`,
            message: `Task status has been updated to ${status} for this donations`,
            timing: `${
              donorHistory.timing
            },Delivery Status updated to ${status} at ${new Date().toLocaleString()}.`,
          },
        });
      }

      const volunteerHistory = await client.history.findFirst({
        where: {
          userId: task.volunteerId,
          donationId: task.Claim.donation.id,
        },
      });
      console.log("volunteerHistory", volunteerHistory);
      if (volunteerHistory) {
        await client.history.update({
          where: {
            id: volunteerHistory.id,
          },
          data: {
            action: `Task status updated to ${status}`,
            message: `Task status has been updated to ${status} for this donations`,
            timing: `${
              volunteerHistory.timing
            },Delivery Status updated to ${status} at ${new Date().toLocaleString()}.`,
          },
        });
      }

      const orgHistory = await client.history.findFirst({
        where: {
          userId: task.Claim.organisation.userId,
          donationId: task.Claim.donation.id,
        },
      });
      console.log("orgHistory", orgHistory);
      if (orgHistory) {
        await client.history.update({
          where: {
            id: orgHistory.id,
          },
          data: {
            action: `Task status updated to ${status}`,
            message: `Task status has been updated to ${status} for this donations`,
            timing: `${
              orgHistory.timing
            },Delivery Status updated to ${status} at ${new Date().toLocaleString()}.`,
          },
        });
      }
    }
  } catch (err) {
    console.log("error in updating task status", (err as Error).message);
    throw new Error((err as Error).message);
  }
};

export const getCliamedDonations = async (volunteerId: string) => {
  try {
    const donations = await client.organisation.findMany({
      where: {
        AND: [{
          claims: {
            some: {
              status: "CLAIMED",
            },
          },
          volunteers: {
            some: {
              id: volunteerId,
            },
          },
        }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        claims: {
          where: {
            status: "CLAIMED",
          },
          select: {
            id: true,
            status: true,
            donation: true,
          },
        },
      },

      orderBy: {
        claims: {
          _count: "desc",
        },
      },
    });
    console.log("donations", donations);
    return {
      status: 200,
      data: donations,
    };
  } catch (err) {
    console.log("error in getting claimed donations", (err as Error).message);
    throw new Error((err as Error).message);
  }
};
