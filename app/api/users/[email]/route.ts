import { NextRequest, NextResponse } from "next/server";
import fetchSession from "@/app/fetchSession";
import usersService from "@/services/users";

// Changing user visibility can be done by sending a PATCH request to this route.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  const session = await fetchSession();

  if (session.type === "inauthenticated")
    return NextResponse.json({ error: "Inauthenticated" }, { status: 401 });
  else if (session.type !== "user")
    return NextResponse.json({ error: "Inauthorized" }, { status: 403 });

  const { email } = params;
  if (session.email !== email)
    return NextResponse.json({ error: "Inauthorized" }, { status: 403 });

  // Visible must be in body and be a boolean
  const body = await req.json();
  if (typeof body.visible !== "boolean")
    return NextResponse.json(
      { message: "Invalid visibility" },
      { status: 400 }
    );
  const { visible } = body;

  const changedUser = await usersService.changeVisibility(
    session.email,
    visible
  );

  return NextResponse.json(changedUser);
}
