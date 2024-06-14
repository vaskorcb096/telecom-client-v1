import {
  ArrowUturnLeftIcon,
  ChartBarIcon,
  CubeIcon,
  DocumentChartBarIcon,
  HomeIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export const navigationData = [
  {
    name: "Dashboard",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Companies",
    href: "/companies",
    icon: UserGroupIcon,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: UsersIcon,
  },
  {
    name: "Retailers",
    href: "/retailers",
    icon: UsersIcon,
  },
  {
    name: "All Sales",
    href: "/all-sales",
    icon: ShoppingCartIcon,
  },
  {
    name: "Sales",
    href: "/sales",
    icon: ShoppingCartIcon,
  },
  {
    name: "All Products",
    href: "/products",
    icon: CubeIcon,
  },
  {
    name: "Brands List",
    href: "/brands",
    icon: ChartBarIcon,
  },
  {
    name: "Category List",
    href: "/category",
    icon: CubeIcon,
  },
  {
    name: "Return Statement",
    href: "/return-statement",
    icon: ArrowUturnLeftIcon,
  },
  {
    name: "Due List",
    href: "/due-list",
    icon: DocumentChartBarIcon,
  },
  {
    name: "Profit/Loss",
    href: "/profit-loss",
    icon: DocumentChartBarIcon,
  },
  {
    name: "Stock Alert",
    href: "/stock-alert",
    icon: CubeIcon,
  },
];
