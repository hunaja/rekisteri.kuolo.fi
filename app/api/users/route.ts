import { NextRequest, NextResponse } from "next/server";
import usersService from "@/services/users";
import { isStudentCourse } from "@/models/User";
import fetchSession from "@/app/fetchSession";

export async function GET(req: NextRequest) {
  const session = await fetchSession();

  if (session.type === "inauthenticated")
    return NextResponse.json({ error: "Inauthenticated" }, { status: 401 });
  else if (session.type === "inauthorized")
    return NextResponse.json({ error: "Inauthorized" }, { status: 403 });

  const courses = (req.nextUrl?.searchParams.get("courses") ?? "").split(",");
  const name = req.nextUrl?.searchParams.get("name") ?? "";
  const next = req?.nextUrl?.searchParams.get("next");

  const users = await usersService.getVisibleStudents(
    {
      name,
      courses: courses.filter((c) => isStudentCourse(c)),
    },
    next
  );
  return NextResponse.json(users);
}
