import { SignIn } from "@clerk/nextjs";

export default function ClerkSignIn() {
  return (
    <div className="flex justify-center flex-1 place-content-center items-center">
      <SignIn />
    </div>
  );
}
