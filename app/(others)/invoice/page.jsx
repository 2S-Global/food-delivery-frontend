"use client";
import dynamic from "next/dynamic";

import Invoice from "@/components/pages-menu/invoice";

const index = () => {
  return (
    <>
      <Invoice />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
