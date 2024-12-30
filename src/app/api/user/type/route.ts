import { client } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  if (!id || !type) {
    return NextResponse.json({ status: 400 });
  }
  // console.log(id, type);

  // WIP: Dynamically rendering these
  try {
    if (type === "Organisation") {
      const userType = await client.organisation.findUnique({
        where: {
          userId: id,
        },
      });
      if (userType) return NextResponse.json({ userType });
    } else if (type === "Volunteer") {
      const userType = await client.volunteer.findUnique({
        where: {
          userId: id,
        },
      });
      if (userType) return NextResponse.json({ userType });
    } else if (type === "Donor") {
      const userType = await client.donor.findUnique({
        where: {
          userId: id,
        },
      });
      if (userType) return NextResponse.json({ userType, type });
    }
    return NextResponse.json({ userType: {} });
  } catch (err) {
    console.log((err as Error).message);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
