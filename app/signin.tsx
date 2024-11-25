import Image from "next/image";
import { signIn } from "./auth";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

export default async function SignIn() {
  const handleSignIn = async () => {
    "use server";
    await signIn("auth0");
  };

  return (
    <div className="flex justify-center">
      <Card className="m-10 sm:m-20 p-10 self-center w-full sm:w-96">
        <form action={handleSignIn} className="flex flex-col items-center">
          <CardHeader className="justify-center">
            <Image
              src="/logo.png"
              alt="KuoLO Ry:n logo"
              width="188"
              height="208"
              className="p-4 w-20"
            />
            <h1 className="text-xl sm:text-2xl my-5">KuoLO Ry</h1>
          </CardHeader>

          <CardBody>
            <Button type="submit" color="primary">
              Kirjaudu sisään
            </Button>
          </CardBody>
        </form>
      </Card>
    </div>
  );
}
