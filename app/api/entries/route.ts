import connectMongo from "@/connectMongo";
import { auth } from "../../auth";
import { NextResponse } from "next/server";
import Entry, { UserInterface } from "@/models/User";
import { FilterQuery } from "mongoose";

const limit = 10;

export const GET = auth(async function GET(req) {
  await connectMongo();

  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const courses = (req.nextUrl?.searchParams.get("courses") ?? "").split(",");
  const nameSearch = req.nextUrl?.searchParams.get("name") ?? "";
  const next = req?.nextUrl?.searchParams.get("next");

  const additionalOpts = {} as FilterQuery<UserInterface>;
  if (nameSearch) {
    additionalOpts.$text = {
      $search: nameSearch,
    };
  }
  if (next) {
    additionalOpts.name = {
      $gt: next,
    };
  }

  const entries = await Entry.find(
    {
      course: {
        $in: courses,
      },
      ...additionalOpts,
    },
    null,
    {
      sort: {
        name: 1,
      },
      limit: limit + 1,
    }
  );
  if (!entries)
    return NextResponse.json({ message: "Server Error" }, { status: 500 });

  const entriesJson = entries.map((e) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...json } = e.toJSON();
    return { ...json, id: _id };
  });

  const nextCursor =
    entries.length === limit + 1 ? entries[entries.length - 2].name : null;
  if (nextCursor) {
    entriesJson.pop();
  }

  return NextResponse.json({
    data: entriesJson,
    next: nextCursor,
  });
});
