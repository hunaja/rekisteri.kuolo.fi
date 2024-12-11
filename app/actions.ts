"use server";

import usersService from "@/services/users";
import { createClerkClient } from "@clerk/backend";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export interface CreateInvitationState {
  message: string;
  error: boolean;
}

export async function createInvitation(
  state: CreateInvitationState,
  formData: FormData
): Promise<CreateInvitationState> {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  const emailAddress = formData.get("emailAddress") as string;
  const user = await usersService.getByEmail(emailAddress);
  if (!user) {
    return {
      message: "Tätä käyttäjää ei löydy jäsenrekisteristä.",
      error: true,
    };
  }

  try {
    const response = await clerkClient.invitations.createInvitation({
      emailAddress,
    });

    console.log(response);
  } catch (e) {
    if (!isClerkAPIResponseError(e)) {
      return {
        message: "Tuntematon virhe, koodi 1.",
        error: true,
      };
    }

    if (e.errors.find((error) => error.code === "form_identifier_exists")) {
      return {
        message:
          "Tili on jo luotu. Paina Unohditko salasanasi? -linkkiä kirjautuessasi, jos haluat palauttaa salasanan.",
        error: true,
      };
    } else if (e.errors.find((error) => error.code === "duplicate_record")) {
      return {
        message:
          "Kutsu on jo lähetetty tälle sähköpostiosoitteelle. Tarkista sähköpostilaatikkosi, myös roskaposti.",
        error: true,
      };
    }

    return {
      message: "Tuntematon virhe, koodi 2.",
      error: true,
    };
  }

  return {
    message: "Kutsu lähetetty onnistuneesti sähköpostiisi.",
    error: false,
  };
}
