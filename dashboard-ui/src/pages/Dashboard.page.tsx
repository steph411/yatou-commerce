import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import SidebarMenu from "@components/SidebarMenu";


// third party libraries
import app from "../firebase"

// icons
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import logo from "@assets/logoy.svg";

// ant design components
import { Input, Button, Avatar, Image, Menu, Dropdown } from "antd";

import { AuthState } from "../Auth";

interface Props {
  authState: AuthState;
}

const { Search } = Input;








const ProfileMenu: React.FC<{onLogout: Function}> = ({onLogout}) => (
  <Menu>
    <Menu.Item>

      <Link to="/profile">
        <a>
          your profile
        </a>
      </Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item>
      <a onClick={() => onLogout()}>
        sign out
      </a>
    </Menu.Item>
  </Menu>
)




const DashboardPage: React.FC<Props> = ({ authState }) => {
  console.log({ authdashboardpage: authState });
  const navigate = useNavigate();
  const handleLogout = async () => {
    await app.auth().signOut() 
    navigate("/login")
  }


  const userImage = authState.user?.photoURL || "";
  const username = authState.user?.displayName || authState.user?.email;
  const onSearch = (value: any) => {
    console.log(value);
  };
  return (
    <section className="grid h-screen bg-white overflow-auto  grid-cols-[minmax(230px,15%),1fr]">
      <aside className="flex flex-col space-y-14 bg-light-blue-800">
        <span className="flex items-center justify-center h-20 overflow-hidden">
          <img src={logo} alt="brand logo" />
        </span>
        <SidebarMenu userRole={authState.userRole} />
      </aside>

      <main className="">
        <header className="flex items-center justify-between h-20 py-5 px-7 bg-light-blue-900">
          <Search
            placeholder="search"
            onSearch={onSearch}
            size="large"
            // className="w-[314px]"
            style={{ width: "314px" }}
          />

          <div className="flex items-center justify-between space-x-6">
            <span>
              <BellOutlined style={{ color: "white", fontSize: "32px" }} />
            </span>

            <div className="flex items-center justify-between space-x-2">
              <span className="font-semibold text-white">{username}</span>
              <span className="grid w-8 h-8 bg-gray-200 rounded-lg place-items-center">
                
                <Dropdown 
                  overlay={<ProfileMenu onLogout={handleLogout} />} 
                  trigger={["click"]} 
                  placement="bottomCenter" 
                  arrow
                >
                  <Avatar
                    shape="square"
                    className="grid place-items-center"
                    icon={<UserOutlined/>}
                    src={
                      userImage &&
                      <Image
                        src={userImage}
                        alt="user profile image"
                      />
                    }
                  />
                </Dropdown>
              </span>
            </div>
          </div>
        </header>

        {/* content section for all the dashboard pages */}
        <section className="p-7">
          <Outlet />
        </section>
      </main>
    </section>
  );
};

export default DashboardPage;
