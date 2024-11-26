import { UserInterface } from "@/models/User";
import {
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/16/solid";
import { Avatar } from "@nextui-org/avatar";
import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
import React from "react";

export default function UserBox({ user }: { user: UserInterface }) {
  return (
    <Card className="mb-5 w-full sm:w-96 flex flex-row items-center">
      <div className="p-5">
        <Avatar
          size="lg"
          name={user.name
            .split(" ")
            .map((s) => s[0])
            .join("")}
        />
      </div>
      <div>
        <CardBody className="">
          <h3 className="text-2xl pt-2">{user.name}</h3>
          <div>
            <div className="flex pt-3 flex-row place-items-center content-center">
              <AcademicCapIcon width={10} />
              <span className="pl-2">
                {user.course.substring(2)}. vuosikurssi
              </span>
            </div>

            <div className="flex flex-row py-3 place-items-center content-center">
              <EnvelopeIcon width={10} />
              <span className="pl-2">
                <Link href={`mailto:${user.email}`}>{user.email}</Link>
              </span>
            </div>

            {user.phoneNumber && (
              <div className="flex flex-row pb-3 place-items-center content-center">
                <PhoneIcon width={10} />
                <span className="pl-2">
                  <Link href={`tel:${user.phoneNumber}`}>
                    {user.phoneNumber}
                  </Link>
                </span>
              </div>
            )}
          </div>
        </CardBody>
      </div>
    </Card>
  );
}
