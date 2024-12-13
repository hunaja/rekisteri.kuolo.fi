import NavigationBar from "../navigation";
import UsersListWrapper from "./list";
import usersService from "@/services/users";
import fetchSession from "../fetchSession";
import { RedirectToSignIn } from "@clerk/nextjs";
import InauthorizedPage from "../inauthorized";

export default async function UsersPage() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") {
    return <RedirectToSignIn />;
  } else if (session.type === "inauthorized") {
    return <InauthorizedPage />;
  }

  // Gets the first page of users
  const initialData = await usersService.getVisibleStudents({
    name: "",
    courses: ["LT1", "LT2", "LT3", "LT4", "LT5", "LT6", "LTn"],
  });
  // Happens on server error: TODO handle this
  if (!initialData) return <p>Server Error</p>;

  return (
    <>
      <NavigationBar selected="users" userName={session.name} />
      <UsersListWrapper initialData={initialData} />
    </>
  );
}
