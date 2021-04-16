import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { roles } from "@types";
// icons
import {
  GiftFilled,
  FolderFilled,
  MoneyCollectFilled,
  PieChartFilled,
  UserOutlined,
  DeleteOutlined as OrdersLogo,
  FileTextOutlined as TermsLogo,
  LineChartOutlined as EarningsLogo,
} from "@ant-design/icons";

interface Props {
  userRole: string | undefined;
}

const SidebarMenu: React.FC<Props> = ({ userRole }) => {
  const { pathname } = useLocation();
  const splitLocation = pathname.split("/")[1];

  const menus = [
    { name: "users", icon: UserOutlined, roles: [roles.admin, roles.vendor] },
    { name: "products", icon: GiftFilled, roles: [roles.admin, roles.vendor] },
    {
      name: "categories",
      icon: FolderFilled,
      roles: [roles.admin],
    },
    {
      name: "orders",
      icon: OrdersLogo,
      roles: [roles.admin, roles.vendor, roles.shipper],
    },
    {
      name: "refunds",
      icon: MoneyCollectFilled,
      roles: [roles.admin, roles.vendor],
    },
    {
      name: "terms",
      icon: TermsLogo,
      roles: [roles.admin, roles.vendor, roles.shipper],
    },
    {
      name: "earnings",
      icon: EarningsLogo,
      roles: [roles.admin, roles.vendor, roles.shipper],
    },
    {
      name: "statistics",
      icon: PieChartFilled,
      roles: [roles.admin, roles.vendor, roles.shipper],
    },
  ];

  return (
    <div className="">
      {menus
        .filter((el) => el.roles.includes(userRole))
        .map((el, id) => (
          <NavLink key={id} to={el.name}>
            <div
              className={` flex justify-start px-8 ${
                splitLocation === el.name
                  ? "bg-white text-light-blue-800"
                  : "hover:bg-light-blue-900 text-white"
              }  transition-all py-4 space-x-4 cursor-pointer`}
            >
              <span>
                {<el.icon style={{ fontSize: "24px", color: `inherit` }} />}
              </span>
              <span className="text-base font-bold">{el.name}</span>
            </div>
          </NavLink>
        ))}
    </div>
  );
};

export default SidebarMenu;
