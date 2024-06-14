"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useSession } from "next-auth/react";
import { navigationData } from "./sidebar-data";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CustomDropdown } from "@/components/common/Dropdown/CustomDropdown";

const Sidebar = () => {
  const pathname = usePathname();
  const session = useSession(authOptions);

  return (
    <div className="flex grow flex-col gap-y-8 border-r border-neutral-300 overflow-y-auto">
      <div className="sticky top-0 pt-5 px-6 pb-2">
        <div className="flex">
          <CustomDropdown />
        </div>
      </div>
      <nav className="flex flex-1 flex-col px-6 overflow-y-auto pb-4">
        <ul
          role="list"
          className="flex flex-1 flex-col gap-y-16 justify-between"
        >
          <li>
            <ul role='list' className='space-y-4'>
              {navigationData.map((item) => (
                (session?.data?.user?.role === 'superAdmin' || item.name !== 'Companies') &&
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex gap-x-2 items-center px-4 py-3 text-base font-mulish font-normal text-neutral-800 ${pathname === item.href ||
                      (item.href.length > 2 && pathname.startsWith(item.href))
                      ? "text-primary-700"
                      : "hover:text-primary-700"
                      }`}
                  >
                    <item.icon
                      height={24}
                      width={24}
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
