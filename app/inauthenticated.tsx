import Image from "next/image";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default async function InauthenticatedPage() {
  return (
    <div className="flex justify-center flex-1 place-content-center">
      <Card className="m-10 sm:m-0 p-10 self-center w-full sm:w-96">
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

        <CardBody className="mt-5">
          <p className="mb-5 text-sm">
            <b className="font-bold">Jäsenet:</b> Sinun on luotava tili samalla
            @student.uef.fi-sähköpostiosoitteella, jolla olet rekisteröitynyt
            KuoLO Ry:n jäseneksi. Tämän jälkeen voit kirjautua sisään.
          </p>

          <p className="mb-5 text-sm">
            <b className="font-bold">Yhteistyökumppanit:</b> Sinun on
            kirjauduttava sisään organisaatiolle annetuilla tunnuksilla.
          </p>

          <SignInButton>
            <Button color="primary">Kirjaudu sisään</Button>
          </SignInButton>
          <SignUpButton>
            <Button
              type="submit"
              color="primary"
              variant="bordered"
              className="mt-5"
            >
              Luo tili
            </Button>
          </SignUpButton>
        </CardBody>
      </Card>
    </div>
  );
}
