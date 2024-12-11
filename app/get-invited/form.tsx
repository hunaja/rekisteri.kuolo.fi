"use client";

import { useFormState } from "react-dom";
import { createInvitation, CreateInvitationState } from "../actions";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export function GetInvitedForm() {
  const [actionState, formAction] = // @ts-expect-error koodattu paskasti
    useFormState<CreateInvitationState>(createInvitation, {
      message: "",
      error: false,
    });

  return (
    <form action={formAction} className="flex flex-col justify-center">
      {actionState.message ? (
        <p
          className={`text-danger ${
            actionState.error ? "text-danger-500" : "text-green-500"
          } font-bold mb-5 text-sm`}
        >
          {actionState.message}
        </p>
      ) : null}

      <Input
        name="emailAddress"
        label="Sähköpostiosoite"
        className="mb-5"
        type="email"
      />

      <Button color="primary" type="submit">
        Lähetä kutsu
      </Button>
    </form>
  );
}
