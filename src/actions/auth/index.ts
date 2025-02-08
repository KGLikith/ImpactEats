"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { onGetAllAccountDomains } from '../settings'

export const onCompleteUserRegistration = async (
  fullname: string,
  clerkId: string,
  email: string,
  type: 'Donor' | 'Organisation' | 'Volunteer'
) => {
  try {
    const user = await currentUser();
    console.log("email",email)
    const registered = await client.user.create({
      data: {
        fullName: fullname,
        email,
        clerkId,
        type,
        imageUrl: user?.imageUrl
      },
      select: {
        fullName: true,
        id: true,
        email: true,
        type: true,
      },
    });
    const notification = await client.notification.create({
      data: {
        userId: registered.id,
        action: "Welcome",
        header: "Welcome",
        type: "info",
        message: `Welcome to ImpactEats, we are glad to have you here. Please contribute to the community by ${type === 'Donor' ? 'donating the surplus food.' : type === 'Organisation' ? 'providing for others.' : 'volunteering to the donations.'}.`,
      },
    })

    if (registered) {
      return { status: 200, user: registered };
    }
  } catch (error) {
    console.log(error)
    return { status: 400 };
  }
};

export const onLoginUser = async () => {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in");
  else {
    try {
      const authenticated = await client.user.findUnique({
        where: {
          clerkId: user.id,
        },
        include: {
          Organisation: {
            select: {
              id: true,
              name: true,
            },
          },
          Donor: {
            select: {
              id: true,
              name: true,
            },
          },
          Volunteer: {
            select: {
              id: true,
              name: true,
            },
          },
        }
      });
      if (authenticated) {
        return { status: 200, user: authenticated, ProfileCompleted: authenticated.Donor || authenticated.Organisation || authenticated.Volunteer };
      }
    } catch (error) {
      console.log(error)
      return { status: 400 };
    }
  }
};
