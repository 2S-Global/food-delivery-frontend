"use client";
import dynamic from "next/dynamic";

import About from "@/components/pages-menu/about";

const index = () => {
  return (
    <>
      <About />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
