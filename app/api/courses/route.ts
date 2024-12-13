import { NextRequest, NextResponse } from "next/server";
import coursesService from "@/services/courses";
import { CourseInterface, isCourseYear } from "@/models/Course";
import fetchSession from "@/app/fetchSession";
import * as yup from "yup";
import { courseYears } from "@/app/constants";

export async function GET(req: NextRequest) {
  const session = await fetchSession();

  if (session.type === "inauthenticated" || session.type === "inauthorized") {
    return NextResponse.json({
      status: 401,
      body: { error: "Unauthorized" },
    });
  }

  const courseYear = req.nextUrl?.searchParams.get("year");
  if (!courseYear) {
    return NextResponse.json({
      status: 400,
      body: { error: "Missing course" },
    });
  }

  if (!isCourseYear(courseYear)) {
    return NextResponse.json({
      status: 400,
      body: { error: "Invalid course year." },
    });
  }

  const courses = await coursesService.getCoursesForYear(courseYear);
  return NextResponse.json(courses);
}

const courseSchema = yup.object({
  name: yup.string().required().min(3),
  code: yup.string(),
  year: yup.string().required().oneOf(courseYears),
});

export async function POST(req: NextRequest) {
  const session = await fetchSession();

  if (session.type === "inauthenticated")
    return NextResponse.json({ error: "Inauthenticated" }, { status: 401 });
  else if (session.type === "inauthorized")
    return NextResponse.json({ error: "Inauthorized" }, { status: 401 });

  let body: CourseInterface;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json(
      {
        error: "Invalid body",
      },
      { status: 400 }
    );
  }

  try {
    await courseSchema.validate(body);
  } catch (e) {
    // Is yup error?
    if (e instanceof yup.ValidationError) {
      console.log(e);
      return NextResponse.json(
        {
          error: e.errors[0],
          path: e.path,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const course = await coursesService.createCourse(
    body.name,
    body.year,
    body.code || undefined
  );
  return NextResponse.json(course);
}
