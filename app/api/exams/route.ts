import * as yup from "yup";
import { NextRequest, NextResponse } from "next/server";
import examsService from "@/services/exams";
import fetchSession from "@/app/fetchSession";

const examForm = yup.object({
  courseId: yup.string().required(),
  description: yup.string().required(),
  year: yup.number().nullable().default(null),
  file: yup
    .object({
      name: yup.string().required(),
      size: yup.number().required(),
    })
    .required(),
});

export async function GET(req: NextRequest) {
  const session = await fetchSession();

  if (session.type === "inauthenticated")
    return NextResponse.json({ error: "Inauthenticated" }, { status: 401 });
  if (session.type === "inauthorized")
    return NextResponse.json({ error: "Inauthorized" }, { status: 403 });

  const queryParams = req.nextUrl.searchParams;
  const invisible = queryParams.get("invisible");
  if (invisible !== "true")
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });

  const exams = await examsService.getAllInvisible();
  return NextResponse.json(exams);
}

export async function POST(req: NextRequest) {
  const session = await fetchSession();

  if (session.type === "inauthenticated")
    return NextResponse.json({ error: "Inauthenticated" }, { status: 401 });
  if (session.type === "inauthorized")
    return NextResponse.json({ error: "Inauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const validatedForm = await examForm.validate(body);

    const createdExam = await examsService.createExam(validatedForm);
    return NextResponse.json(createdExam);
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      console.error(e);
      return NextResponse.json(
        {
          error: e.errors[0],
          path: e.path,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
