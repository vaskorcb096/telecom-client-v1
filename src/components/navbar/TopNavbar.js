"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const TopNavbar = () => {
  const handleLogout = () => {
    signOut();
    localStorage.removeItem("product");
    redirect("/auth/sign-in");
  };

  const session = useSession();
  return (
    <div className="flex flex-1 self-stretch items-center justify-between">
      <h1 className="text-neutral text-lg sm:text-[26px] font-extrabold">
        Dashboard
      </h1>

      <div className="flex gap-2 items-center">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{session?.data?.user?.phone}</p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopNavbar;
