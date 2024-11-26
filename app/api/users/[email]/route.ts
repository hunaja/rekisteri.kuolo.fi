import connectMongo from "@/connectMongo";
import { auth } from "../../../auth";
import { NextResponse } from "next/server";
import User from "@/models/User";

export const GET = auth(async function GET(req) {
  await connectMongo();

  const queryParams = req.nextUrl.searchParams;
  // const apiToken = queryParams.get("apiToken");
  const authEmail = req.auth?.user?.email;
  // @ts-expect-error
  const requestedEmail = req.query.email;

  if (authEmail !== requestedEmail)
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });

  const user = await User.findOne({ email: requestedEmail });

  return NextResponse.json(user?.toJSON() ?? null);
});

// Changing user visibility can be done by sending a PATCH request to this route.
export const PATCH = auth(async function PATCH(req) {
  await connectMongo();

  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const authEmail = req.auth.user?.email;

  const user = await User.findOne({ email: authEmail });
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Visible must be in body and be a boolean
  const body = await req.json();
  if (typeof body.visible !== "boolean")
    return NextResponse.json(
      { message: "Invalid visibility" },
      { status: 400 }
    );

  user.visible = body.visible;
  await user.save();

  return NextResponse.json(user.toJSON());
});
