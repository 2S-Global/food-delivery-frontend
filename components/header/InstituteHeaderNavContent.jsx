"use client";

import Link from "next/link";
import {
  blogItems,
  candidateItems,
  employerItems,
  findJobItems,
  homeItems,
  pageItems,
  shopItems,
  about,
  contact,
} from "../../data/mainMenuData";
import {
  isActiveParent,
  isActiveLink,
  isActiveParentChaild,
} from "../../utils/linkActiveChecker";
import { usePathname } from "next/navigation";

const HeaderNavContent = () => {
  return (
    <>
      <nav className="nav main-menu">
        <ul className="navigation" id="navbar">
          {/* current dropdown */}
          <li
            className={`${
              isActiveParent(homeItems, usePathname()) ? "current" : ""
            } dropdown`}
          >
            <Link href="/">Home</Link>
          </li>
          {/* End homepage menu items */}

          <li
            className={`${
              isActiveParent(findJobItems, usePathname()) ? "current" : ""
            } dropdown has-mega-menu`}
            id="has-mega-menu"
          >
            <Link href="/job-list">Find Jobs</Link>
          </li>
          {/* End findjobs menu items */}

          <li
            className={`${
              isActiveParent(employerItems, usePathname()) ||
              usePathname()?.split("/")[1] === "employers-dashboard"
                ? "current"
                : ""
            } dropdown`}
          >
            <Link href="/employers-list">Employers</Link>
          </li>
          {/* End Employers menu items */}

          <li
            className={`${
              isActiveParent(candidateItems, usePathname()) ||
              usePathname()?.split("/")[1] === "candidates-dashboard"
                ? "current"
                : ""
                  ? "current"
                  : ""
            } dropdown`}
          >
            <Link href="/candidates-list">
              <span>Candidates</span>
            </Link>
          </li>
          {/* End Candidates menu items */}

          <li
            className={`${
              isActiveParentChaild(blogItems, usePathname()) ? "current" : ""
            } dropdown`}
          >
            <Link href="/blog-list">
              <span>Blog</span>
            </Link>
          </li>
          {/* End Blog menu items */}

          <li
            className={`${
              isActiveParent(about, usePathname()) ||
              usePathname()?.split("/")[1] === "about"
                ? "current"
                : ""
                  ? "current"
                  : ""
            } dropdown`}
          >
            <Link href="/about">
              <span>About</span>
            </Link>
          </li>
          {/* End About menu items */}

          <li
            className={`${
              isActiveParent(contact, usePathname()) ||
              usePathname()?.split("/")[1] === "contact"
                ? "current"
                : ""
                  ? "current"
                  : ""
            } dropdown`}
          >
            <Link href="/contact">
              <span>Contact</span>
            </Link>
          </li>

          {/*  <li
            className={`${
              isActiveParentChaild(pageItems, usePathname()) ||
              isActiveParentChaild(shopItems[0].items, usePathname())
                ? "current "
                : ""
            } dropdown`}
          >
            <span>Pages</span>
            <ul>
              {shopItems.map((item) => (
                <li className="dropdown" key={item.id}>
                  <span
                    className={`${
                      isActiveParentChaild(shopItems[0].items, usePathname())
                        ? "current "
                        : ""
                    }`}
                  >
                    {item.title}
                  </span>
                  <ul>
                    {item.items.map((menu, i) => (
                      <li
                        className={
                          isActiveLink(menu.routePath, usePathname())
                            ? "current"
                            : ""
                        }
                        key={i}
                      >
                        <Link href={menu.routePath}>{menu.name}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              {pageItems.map((item, i) => (
                <li
                  className={
                    isActiveLink(item.routePath, usePathname()) ? "current" : ""
                  }
                  key={i}
                >
                  <Link href={item.routePath}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </li> */}
          {/* End Pages menu items */}
        </ul>
      </nav>
    </>
  );
};

export default HeaderNavContent;
