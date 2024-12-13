import * as yup from "yup";
import { NextRequest, NextResponse } from "next/server";
import examsService from "@/services/exams";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedForm = await examForm.validate(body);

    const createdExam = await examsService.createExam(validatedForm);
    return NextResponse.json(createdExam);
  } catch (e) {
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

    console.log(e);

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
