"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";

export default function StyledSignOutButton() {
  const { signOut } = useClerk();

  return (
    <>
      <Button color="danger" onClick={() => signOut({ redirectUrl: "/" })}>
        Kirjaudu ulos
      </Button>
    </>
  );
}
