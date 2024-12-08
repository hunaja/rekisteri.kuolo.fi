import NavigationBar from "./navigation";
import VisibilitySwitch from "./visibilitySwitch";
import UserBox from "./users/box";
import SignOutModal from "./signOutModal";
import fetchSession from "./fetchSession";
import InauthenticatedPage from "./inauthenticated";
import InauthorizedPage from "./inauthorized";

export default async function Home() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") {
    return <InauthenticatedPage />;
  } else if (session.type === "inauthorized") {
    return <InauthorizedPage />;
  }

  return (
    <>
      <NavigationBar selected="user" userName={session.name} />

      <main className="sm:px-10 block sm:flex flex-row justify-between min-h-full flex-1">
        <div className="w-full sm:w-96 flex flex-col align-center justify-center place-items-center flex-1">
          <h1 className="text-3xl mb-10 text-center">
            {session.type === "advertiser"
              ? `Tervetuloa mainostaja ${session.name}!`
              : `Profiili`}
          </h1>

          {session.type === "user" && (
            <div className="place-items-center">
              <UserBox user={session} />

              {session.course !== "alumni" && (
                <VisibilitySwitch
                  initialState={session.visible}
                  user={session}
                />
              )}
            </div>
          )}

          <SignOutModal />
        </div>
      </main>
    </>
  );
}
