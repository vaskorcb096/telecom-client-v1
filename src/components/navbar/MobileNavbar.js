"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationData } from "@/components/Sidebar/sidebar-data";
import { ScrollShadow } from "@nextui-org/react";

const MobileNavbar = () => {
  const pathname = usePathname()

  return (
    <ScrollShadow
      hideScrollBar
      offset={100}
      className='flex w-full scroll-container'
    >
      <ul role='list' className='flex justify-between px-5'>
        {navigationData.map((item) => (
          <li
            key={item.name}
            className="w-[80px]"
          >
            <Link href={item.href} className={`text-xs flex flex-col items-center gap-1 ${pathname === item.href ||
              (item.href.length > 2 && pathname.startsWith(item.href))
              ? "text-primary-700 font-semibold"
              : "hover:text-primary-700"
              }`}>
              <item.icon
                height={24}
                width={24}
              />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </ScrollShadow>
  );
};

export default MobileNavbar;
