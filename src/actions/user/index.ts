"use server";
import { client } from "@/lib/prisma";
import {
  EditorganizationProfileSchema,
  EditUserProfileSchema,
} from "@/schemas/auth.schema";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

export const updateUser = async (
  value: z.infer<typeof EditUserProfileSchema>,
  id: string,
  type: string,
  imageUrl: string,
  email: string
) => {
  console.log(email);
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
          email: email,
        },
        create: {
          name: value.name,
          phone: value.phone,
          address: value.address,
          imageUrl: imageUrl,
          userId: id,
          email: email,
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
          email: email,
        },
        create: {
          name: value.name,
          phone: value.phone,
          email: email,
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

export const updateOrganisation = async (
  values: z.infer<typeof EditorganizationProfileSchema>,
  id: string,
  imageUrl: string
) => {
  try {
    const res = await client.organisation.upsert({
      where: {
        userId: id,
      },
      update: {
        name: values.name,
        phone: values.phone ?? "",
        address: values.address,
        website: values.website,
        imageUrl: imageUrl,
        description: values.description,
      },
      create: {
        name: values.name,
        email: values.email,
        phone: values.phone ?? "",
        address: values.address,
        website: values.website,
        description: values.description,
        imageUrl: imageUrl,
        userId: id,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    console.log(query);
    // const users = await client.user.findMany({
    //   where: {
    //     OR: [
    //       { firstname: { contains: query } },
    //       { email: { contains: query } },
    //       { lastname: { contains: query } },
    //     ],
    //     NOT: [{ clerkid: user.id }],
    //   },
    //   select: {
    //     id: true,
    //     subscription: {
    //       select: {
    //         plan: true,
    //       },
    //     },
    //     firstname: true,
    //     lastname: true,
    //     image: true,
    //     email: true,
    //   },
    // })

    // if (users && users.length > 0) {
    //   return { status: 200, data: users }
    // }

    return { status: 404, data: undefined };
  } catch (error) {
    console.log(error);
    return { status: 500, data: undefined };
  }
};

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const notifications = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
        Notification: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            Notification: true,
          },
        },
      },
    });

    if(!notifications) return { status: 404 ,data: {
      Notification: [],
      _count: {
        Notification: 0,
      },
    },};
    const unreadNotifications = await client.notification.count({
      where: {
        userId: notifications.id,
        isRead: false,
      },
    });
    if (notifications && notifications.Notification.length > 0) {
      return { status: 200, data: notifications, unreadNotifications };
    }
    return {
      status: 400,
      data: {
        Notification: [],
        _count: {
          Notification: 0,
        },
      },
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      data: {
        Notification: [],
        _count: {
          Notification: 0,
        },
      },
    };
  }
};

export const getDonorHistory = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const history = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        history: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            donation: {
              select:{
                id: true,
                name: true,
                description: true,
                foodType: true,
                address: true,
                phone: true,
                email: true,
                quantity: true,
                quantityUnit: true,
                status: true,
                deliveryType: true,
                requestId: true,
                createdAt: true,
                updatedAt: true,
                donor: true,
                claim:{
                  select:{
                    id: true,
                    task:{
                      select:{
                        id: true,
                        volunteer:{
                          select:{
                            id: true,
                            name: true,
                            phone: true,
                            imageUrl: true,
                            email: true,
                          },
                        },
                      },
                    },
                    organisation:{
                      select:{
                        id: true,
                        name: true,
                        phone: true,
                        imageUrl: true,
                        email: true,
                      },
                    },
                  },
                }
              }
            }
          },
        },
      },
    });
    if (history && history.history.length > 0) { 
      return { status: 200, data:history.history};
    }
    return { status: 404, data: [] };
  } catch (err) {
    console.log(err);
    return { status: 500, data: [] };
  }
};

export const getContributions = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const contributions = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        Donor: {
          select: {
            donations: {
              where: {
                status: "COMPLETED",
              },
              select: {
                id: true,
                quantity: true,
                quantityUnit: true,
                foodType: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                claim: {
                  select: {
                    id: true,
                    task: {
                      select: {
                        id: true,
                        volunteer: {
                          select: {
                            id: true,
                            name: true,
                            phone: true,
                            imageUrl: true,
                            email: true,
                          },
                        },
                      },
                    },
                    organisation: {
                      select: {
                        id: true,
                        name: true,
                        phone: true,
                        imageUrl: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        Organisation: {
          select: {
            claims: {
              where: {
                status: "RECIEVED",
              },
              select: {
                id: true,
                task: {
                  select: {
                    id: true,
                    volunteer: {
                      select: {
                        id: true,
                        name: true,
                        phone: true,
                        imageUrl: true,
                        email: true,
                      },
                    },
                  },
                },
                updatedAt: true,
                donation: {
                  select: {
                    id: true,
                    quantity: true,
                    quantityUnit: true,
                    foodType: true,
                    description: true,
                    donor: {
                      select: {
                        name: true,
                        phone: true,
                        imageUrl: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        Volunteer: {
          select: {
            task: {
              where: {
                status: "COMPLETED",
              },
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                volunteer: {
                  select: {
                    id: true,
                    name: true,
                    phone: true,
                    imageUrl: true,
                    email: true,
                  },
                },
                Claim: {
                  select: {
                    id: true,
                    organisation: {
                      select: {
                        id: true,
                        name: true,
                        phone: true,
                        imageUrl: true,
                        email: true,
                      },
                    },
                    donation: {
                      select: {
                        id: true,
                        quantity: true,
                        quantityUnit: true,
                        foodType: true,
                        description: true,
                        donor: {
                          select: {
                            name: true,
                            phone: true,
                            imageUrl: true,
                            email: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log(contributions);
    if (contributions?.Donor?.donations) {
      return { status: 200, data: contributions.Donor, type: "Donations" };
    }
    if (contributions?.Organisation?.claims) {
      return { status: 200, data: contributions.Organisation, type: "Claims" };
    }
    if (contributions?.Volunteer?.task) {
      return { status: 200, data: contributions.Volunteer, type: "Tasks" };
    }
    return { status: 404, data: [] };
  } catch (err) {
    console.log(err);
    return { status: 500, data: [] };
  }
};
