import User from "@/models/User";
import { auth } from "../auth";
import NavigationBar from "../navigationBar";
import AuthorizeWindow from "../authorize";
import UsersListWrapper from "./usersList";
import connectMongo from "@/connectMongo";

export default async function Directory() {
  const session = await auth();
  if (!session?.user) {
    return <AuthorizeWindow />;
  }

  await connectMongo();

  const user = await User.findOne({ email: session.user.email });

  return (
    <>
      <NavigationBar
        selected="directory"
        userName={user?.name ?? session.user.name}
      />
      <UsersListWrapper />
    </>
  );
}
