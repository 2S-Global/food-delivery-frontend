"use client";
import dynamic from "next/dynamic";

import Terms from "@/components/pages-menu/terms";

const index = () => {
  return (
    <>
      <Terms />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
