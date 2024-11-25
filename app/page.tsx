import { auth } from "./auth";
import NavigationBar from "./navigationBar";
import SignIn from "./signin";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return <SignIn />;
  }

  return (
    <>
      <NavigationBar selected="wiki" />

      <main className="px-10">
        <div>
          <h1 className="text-2xl">Tervetuloa</h1>
          <p className="py-2">
            Paina menun Jäsenet-nappia selataksesi jäseniä.
          </p>
        </div>
      </main>
    </>
  );
}
