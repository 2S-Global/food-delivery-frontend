"use client";
import dynamic from "next/dynamic";

import LogIn from "@/components/pages-menu/login";

const index = () => {
  return (
    <>
      <LogIn />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
