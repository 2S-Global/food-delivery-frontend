"use client";
import dynamic from "next/dynamic";

import Faq from "@/components/pages-menu/faq";

const index = () => {
  return (
    <>
      <Faq />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
