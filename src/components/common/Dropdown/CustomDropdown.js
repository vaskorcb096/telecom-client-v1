"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  DropdownSection,
  Image,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CompanyLogo from "../SvgIcon/CompanyLogo";
import { ChevronDownIcon } from "../SvgIcon/ChevronDownIcon";
import { useEffect, useState } from "react";
import axiosInstance from "@/services/axiosInstance";

export const CustomDropdown = () => {
  const router = useRouter();
  const session = useSession();
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    const handleUser = () => {
      if (session?.data?.user?.role === "superAdmin") {
        axiosInstance
          .get(`/users`)
          .then((res) => {
            console.log("hello", res);
            setCompanies(res.data.payload.users);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    handleUser();
  }, [session]);

  console.log("cmppm", companies);

  return session?.data?.user?.role === "superAdmin" ? (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          className="font-bold text-lg flex  items-center  "
          variant="light"
          size="lg "
        >
          <div className=" justify-center">
            <Image
              radius="none"
              width={50}
              alt="NextUI hero Image"
              src={"/assets/images/logo-no-background.svg"}
            />
          </div>
          <div className="flex items-center">
            Chaity
            <ChevronDownIcon />
          </div>
        </Button>
      </DropdownTrigger>

      <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
        <DropdownSection title="Companies">
          {companies.map((cmp, index) => {
            console.log("Hello Hello", cmp);
            if (cmp.role !== "superAdmin") {
              return (
                <DropdownItem key={index}>
                  <div className="flex items-center">
                    <CompanyLogo />
                    <div>
                      <h1>{cmp.name}</h1>
                      <p className="text-gray-500 text-xs">{cmp.address}</p>
                    </div>
                  </div>
                </DropdownItem>
              );
            } else {
              return null; // Don't render anything if role is "superAdmin"
            }
          })}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <div
      className="flex items-center"
      role="button"
      onClick={() => router.push("/")}
    >
      <CompanyLogo />
      <div>
        <h1>{session?.data?.user?.name}</h1>
        <p className="text-gray-500 text-xs">{session?.data?.user?.address}</p>
      </div>
    </div>
  );
};
