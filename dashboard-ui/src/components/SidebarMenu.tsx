import React from 'react';
import { Link, NavLink, useLocation } from "react-router-dom";

// icons
import {
  GiftFilled,
  FolderFilled,
  MoneyCollectFilled,
  PieChartFilled,
  DeleteOutlined as OrdersLogo,
  FileTextOutlined as TermsLogo,
  LineChartOutlined as EarningsLogo
} from "@ant-design/icons";




interface Props{

}



const SidebarMenu: React.FC<Props> = ({}) => {
  
  const {pathname} = useLocation();
  const splitLocation = pathname.split("/")[1]
  
  const menus = [
    { name: "products", icon: GiftFilled },
    { name: "categories", icon: FolderFilled },
    { name: "orders", icon: OrdersLogo },
    { name: "refunds", icon: MoneyCollectFilled },
    { name: "terms", icon: TermsLogo },
    { name: "statistics", icon: PieChartFilled },
    { name: "earnings", icon: EarningsLogo },
  ];

  console.log({pathname, splitLocation})
  return (
    <div className="">
      {menus.map((el, id) => (
        <NavLink key={id} to={el.name}>
          <div
            className={` flex justify-start px-8 ${
              splitLocation === el.name
                ? "bg-white text-light-blue-800"
                : "hover:bg-light-blue-900 text-white"
            }  transition-all py-6 space-x-4 cursor-pointer`}
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
}


export default SidebarMenu