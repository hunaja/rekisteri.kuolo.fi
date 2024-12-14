import connectMongo from "@/connectMongo";
import User, { ApiUser, StudentCourse, UserInterface } from "@/models/User";
import { FilterQuery } from "mongoose";

const LIMIT = 10;

interface SearchOptions {
  name: string;
  courses: StudentCourse[];
}

async function getVisibleStudents(
  search: SearchOptions = { name: "", courses: [] },
  // String when paginating, null when not, undefined when not provided
  next?: string | null | undefined
): Promise<{ data: UserInterface[]; next: string | null } | null> {
  await connectMongo();

  const searchOptions = {} as FilterQuery<UserInterface>;

  if (search.name) {
    searchOptions.$text = {
      $search: search.name,
    };
  }

  if (next) {
    searchOptions.name = {
      $gt: next,
    };
  }

  const users = await User.find(
    {
      visible: true,
      course: {
        $in: search.courses,
        $ne: "alumni",
      },
      ...searchOptions,
    },
    null,
    {
      sort: {
        name: 1,
      },
      limit: LIMIT + 1,
    }
  );
  if (!users) return { data: [], next: null };

  const entriesJson = users.map((e) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...json } = e.toJSON();
    return { ...json, id: _id };
  });

  const nextCursor =
    users.length === LIMIT + 1 ? users[users.length - 2].name : null;
  if (nextCursor) {
    entriesJson.pop();
  }

  return {
    data: entriesJson,
    next: nextCursor,
  };
}

async function getByEmail(email: string): Promise<ApiUser | null> {
  await connectMongo();

  const user = await User.findOne({ email });
  const jsonUser = user?.toJSON();
  return jsonUser ?? null;
}

async function changeVisibility(
  email: string,
  visible: boolean
): Promise<UserInterface> {
  await connectMongo();

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  user.visible = visible;
  await user.save();

  return user.toJSON();
}

const usersService = {
  getVisibleStudents,
  getByEmail,
  changeVisibility,
};

export default usersService;
