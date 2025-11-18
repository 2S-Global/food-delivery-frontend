"use client";
import dynamic from "next/dynamic";

import Pricing from "@/components/pages-menu/pricing";

const index = () => {
  return (
    <>
      <Pricing />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
