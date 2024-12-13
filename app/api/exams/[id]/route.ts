import fetchSession from "@/app/fetchSession";
import examsService from "@/services/exams";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await fetchSession();

  if (session.type === "inauthenticated") {
    return NextResponse.json({ error: "Inauthenticated" }, { status: 401 });
  } else if (session.type === "inauthorized") {
    return NextResponse.json({ error: "Inauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const exam = await examsService.changeVisibility(params.id, body.visible);

  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  return NextResponse.json(exam, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await fetchSession();

  if (session.type === "inauthenticated") {
    return NextResponse.json({ error: "Inauthenticated" }, { status: 401 });
  } else if (session.type === "inauthorized") {
    return NextResponse.json({ error: "Inauthorized" }, { status: 403 });
  }

  await examsService.deleteExam(params.id);

  return NextResponse.json({ success: true }, { status: 200 });
}
