import Image from "next/image";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import StyledSignOutButton from "./signOutButton";

export default async function InauthorizedPage() {
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
          <h1 className="text-xl sm:text-2xl my-5">Ei pääsyä</h1>
        </CardHeader>

        <CardBody className="pt-5">
          <p className="pb-5">
            Sinun on luotava käyttäjäsi @student.uef.fi-sähköpostiosoitteella,
            joka löytyy jäsenrekisteristä.
          </p>

          <StyledSignOutButton />
        </CardBody>
      </Card>
    </div>
  );
}
