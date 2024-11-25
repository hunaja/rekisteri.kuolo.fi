import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { signOut } from "./auth";

import Image from "next/image";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

export default function NavigationBar({
  selected,
}: {
  selected: "wiki" | "exams" | "videos" | "directory";
}) {
  const handleSignOut = async () => {
    "use server";
    await signOut();
  };

  return (
    <Navbar shouldHideOnScroll className="mb-5">
      <NavbarContent>
        <NavbarMenuToggle aria-label={"Toggle menu"} className="sm:hidden" />
        <NavbarBrand>
          <Image
            src="/logo.png"
            alt="KuoLO Ry:n logo"
            className="w-12 h-12"
            width="188"
            height="208"
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={selected === "wiki"}>
          <Link color={selected === "wiki" ? "primary" : "foreground"} href="/">
            Etusivu
          </Link>
        </NavbarItem>
        <NavbarItem isActive={selected === "directory"}>
          <Link
            color={selected === "directory" ? "primary" : "foreground"}
            href="/directory"
          >
            Jäsenet
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem isActive={selected === "wiki"} className="p-2">
          <Link
            color={selected === "wiki" ? "primary" : "foreground"}
            href="/"
            size="lg"
            className="w-full"
          >
            Etusivu
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive={selected === "directory"} className="p-2">
          <Link
            color={selected === "directory" ? "primary" : "foreground"}
            href="/directory"
            size="lg"
            className="w-full"
          >
            Jäsenet
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>

      <NavbarContent className="gap-4" justify="end">
        <NavbarItem>
          <form action={handleSignOut}>
            <Button
              type="submit"
              color="danger"
              variant="bordered"
              className="hidden sm:flex"
              startContent={<ArrowRightStartOnRectangleIcon width={15} />}
            >
              Kirjaudu ulos
            </Button>
            <Button
              type="submit"
              color="danger"
              variant="bordered"
              className="flex sm:hidden"
              isIconOnly
            >
              <ArrowRightStartOnRectangleIcon width={15} />
            </Button>
          </form>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
