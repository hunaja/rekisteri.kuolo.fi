import Image from "next/image";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { SignInButton } from "@clerk/nextjs";
import { Link } from "@nextui-org/react";

export default async function InauthenticatedPage() {
  return (
    <div className="flex justify-center flex-1 place-content-center">
      <Card className="m-10 sm:m-0 px-10 py-5 self-center w-full sm:w-96">
        <CardHeader className="justify-center">
          <Image
            src="/logo.png"
            alt="KuoLO Ry:n logo"
            width="188"
            height="208"
            className="p-4 w-20"
          />
          <h1 className="text-xl sm:text-2xl my-5">Jäsensivut</h1>
        </CardHeader>

        <CardBody className="pt-5">
          <p className="mb-5">
            Sinulle on lähetetty kutsu tilin luomiseen jäsensivuille, mikäli
            olet <b className="font-bold">KuoLO Ry:n jäsen tai alumni</b>.
          </p>
          <SignInButton>
            <Button color="primary" className="w-full">
              Kirjaudu sisään
            </Button>
          </SignInButton>
        </CardBody>
        <CardFooter className="flex flex-col place-items-start">
          <p className="">
            Jos et ole saanut kutsua, voit uudelleenlähettää sen{" "}
            <Link href="/get-invited">täältä</Link>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
