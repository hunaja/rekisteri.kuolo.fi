import fetchSession from "@/app/fetchSession";
import examsService from "@/services/exams";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await fetchSession();

  if (session.type === "inauthenticated")
    return NextResponse.json({ error: "Inauthenticated" }, { status: 401 });
  if (session.type === "inauthorized")
    return NextResponse.json({ error: "Inauthorized" }, { status: 403 });

  const { id } = params;
  const downloadUrl = await examsService.getExamDownloadUrl(id);

  return NextResponse.json({ url: downloadUrl });
}
