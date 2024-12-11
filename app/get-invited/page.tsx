import Image from "next/image";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import fetchSession from "../fetchSession";
import { redirect } from "next/navigation";
import { GetInvitedForm } from "./form";

export default async function GetInvitedPage() {
  const session = await fetchSession();
  if (session.type !== "inauthenticated") {
    return redirect("/");
  }

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
          <h1 className="text-xl sm:text-2xl my-5">Hanki kutsu</h1>
        </CardHeader>

        <CardBody className="pt-5">
          <p className="pb-5">
            Käytäthän sähköpostiosoitetta, jonka olet ilmoittanut Kide.appissa.
            Jäsenillä tämä on @student.uef.fi-päätteinen.
          </p>

          <GetInvitedForm />
        </CardBody>
      </Card>
    </div>
  );
}
