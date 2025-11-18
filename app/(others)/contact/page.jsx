"use client";
import dynamic from "next/dynamic";

import Contact from "@/components/pages-menu/contact";

const index = () => {
  return (
    <>
      <Contact />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
