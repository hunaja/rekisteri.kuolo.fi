import advertiserUsers, { AdvertiserUser } from "@/advertiserUsers";
import { ApiUser } from "@/models/User";
import usersService from "@/services/users";
import { currentUser } from "@clerk/nextjs/server";

export type UserSession = {
  type: "user";
  id: string;
} & ApiUser;

export type AdvertiserSession = {
  type: "advertiser";
} & AdvertiserUser;

export type InauthenticatedSession = {
  type: "inauthenticated";
};

export type InauthorizedSession = {
  type: "inauthorized";
  email?: string;
};

export type Session =
  | UserSession
  | AdvertiserSession
  | InauthenticatedSession
  | InauthorizedSession;

export default async function fetchSession(): Promise<Session> {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return {
      type: "inauthenticated",
    };
  }

  const verifiedEmail = clerkUser.emailAddresses.find(
    (e) => e.verification?.status === "verified"
  )?.emailAddress;

  if (!verifiedEmail) {
    return {
      type: "inauthorized",
    };
  }

  const user = await usersService.getByEmail(verifiedEmail);
  if (user) return { type: "user", ...user };

  const advertiser = advertiserUsers.find((u) => u.email === verifiedEmail);
  if (advertiser) return { type: "advertiser", ...advertiser };

  return {
    type: "inauthorized",
    email: verifiedEmail,
  };
}
