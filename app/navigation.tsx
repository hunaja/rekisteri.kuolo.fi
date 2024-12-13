import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";

import Image from "next/image";
import { Avatar } from "@nextui-org/avatar";

export default function NavigationBar({
  selected,
  userName,
}: {
  selected: "user" | "users" | "videos" | "exams";
  userName: string;
}) {
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
        <NavbarItem isActive={selected === "user"}>
          <Link color={selected === "user" ? "primary" : "foreground"} href="/">
            Profiili
          </Link>
        </NavbarItem>
        <NavbarItem isActive={selected === "users"}>
          <Link
            color={selected === "users" ? "primary" : "foreground"}
            href="/students"
          >
            Opiskelijat
          </Link>
        </NavbarItem>
        <NavbarItem isActive={selected === "exams"}>
          <Link
            color={selected === "exams" ? "primary" : "foreground"}
            href="/exams"
          >
            Tentit
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem isActive={selected === "user"} className="p-2">
          <Link
            color={selected === "user" ? "primary" : "foreground"}
            href="/"
            size="lg"
            className="w-full"
          >
            Profiili
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive={selected === "users"} className="p-2">
          <Link
            color={selected === "users" ? "primary" : "foreground"}
            href="/students"
            size="lg"
            className="w-full"
          >
            Opiskelijat
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive={selected === "exams"} className="p-2">
          <Link
            color={selected === "exams" ? "primary" : "foreground"}
            href="/exams"
            size="lg"
            className="w-full"
          >
            Tentit
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>

      <NavbarContent className="gap-4" justify="end">
        <NavbarItem>
          <Avatar
            size="sm"
            name={userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          />
        </NavbarItem>
        <NavbarItem className="hidden sm:block text-sm">{userName}</NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
