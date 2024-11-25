import { auth } from "../auth";
import NavigationBar from "../navigationBar";
import SignIn from "../signin";
import EntryListWrapper from "./entryList";

export default async function Directory() {
  const session = await auth();
  if (!session?.user) {
    return <SignIn />;
  }

  return (
    <>
      <NavigationBar selected="directory" />
      <div className="flex flex-col h-full">
        <EntryListWrapper />
      </div>
    </>
  );
}
