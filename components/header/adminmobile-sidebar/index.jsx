"use client";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import mobileMenuData from "../../../data/adminMobilemenudata";
/* import SidebarFooter from "./SidebarFooter"; */
import SidebarHeader from "./SidebarHeader";
import {
  isActiveLink,
  isActiveParentChaild,
} from "../../../utils/linkActiveChecker";
import { usePathname, useRouter } from "next/navigation";

const Index = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className="offcanvas offcanvas-start mobile_menu-contnet"
      tabIndex="-1"
      id="offcanvasMenu"
      data-bs-scroll="true"
    >
      <SidebarHeader />
       <p
          style={{
            textAlign: "center",
            fontWeight: "800",
            fontSize: "20px",
            marginTop: "20px",
            backgroundColor: "#FF0000", // Set background color
            color: "white", // Set text color
            padding: "10px", // Optional: add some padding
            borderRadius: "5px", // Optional: rounded corners
          }}
        >
          Admin Panel
        </p>
      <Sidebar>
        <Menu>
          {mobileMenuData.map((item) =>
            item.items && item.items.length > 0 ? (
              <SubMenu
                className={
                  isActiveParentChaild(item.items, pathname)
                    ? "menu-active"
                    : ""
                }
                label={item.label}
                key={item.id}
              >
                {item.items.map((menuItem, i) => (
                  <MenuItem
                    onClick={() => router.push(menuItem.routePath)}
                    className={
                      isActiveLink(menuItem.routePath, pathname)
                        ? "menu-active-link"
                        : ""
                    }
                    key={i}
                  >
                    {menuItem.label}
                  </MenuItem>
                ))}
              </SubMenu>
            ) : (
              <MenuItem
                onClick={() => router.push(item.routePath)}
                className={
                  isActiveLink(item.routePath, pathname)
                    ? "menu-active-link"
                    : ""
                }
                key={item.id}
              >
                {item.label}
              </MenuItem>
            )
          )}
        </Menu>
      </Sidebar>

      {/*  <SidebarFooter /> */}
    </div>
  );
};

export default Index;
