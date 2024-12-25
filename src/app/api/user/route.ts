import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorised", status: 401 });
    const result = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });
    if (result)
      return NextResponse.json({
        status: 201,
        user: result,
      });
    return NextResponse.json({ status: 400 });
  } catch (err) {
    console.log((err as Error).message);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
