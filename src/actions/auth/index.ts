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
    console.log(email)
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
        select: {
          fullName: true,
          id: true,
          type: true,
        },
      });
      if (authenticated) {
        return { status: 200, user: authenticated };
      }
    } catch (error) {
      console.log(error)
      return { status: 400 };
    }
  }
};
