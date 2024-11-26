import { Button } from "@nextui-org/button";
import { auth, signOut } from "./auth";
import NavigationBar from "./navigationBar";
import AuthorizeWindow from "./authorize";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";
import User from "@/models/User";
import UserBox from "./directory/box";
import VisibilitySwitch from "./visibilitySwitch";
import connectMongo from "@/connectMongo";

export default async function Home() {
  const session = await auth();

  await connectMongo();

  if (!session?.user) {
    return <AuthorizeWindow />;
  }

  let user = await User.findOne({ email: session.user.email });

  return (
    <>
      <NavigationBar
        selected="user"
        userName={user?.name ?? session.user.name}
      />

      <main className="sm:px-10 block sm:flex flex-row justify-between min-h-full flex-1">
        <div className="w-full sm:w-96 flex flex-col align-center justify-center place-items-center flex-1">
          <h1 className="text-3xl mb-10 text-center">
            Tervetuloa, {user?.name.split(" ")[0] ?? session.user.name}!
          </h1>

          {user && (
            <div className="place-items-center">
              <UserBox user={user} />

              <VisibilitySwitch
                initialState={user.visible}
                user={user.toJSON()}
              />
            </div>
          )}

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              type="submit"
              color="danger"
              variant="solid"
              className="self-center mt-5"
              size="lg"
              startContent={<ArrowRightStartOnRectangleIcon width={15} />}
            >
              Kirjaudu ulos
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
