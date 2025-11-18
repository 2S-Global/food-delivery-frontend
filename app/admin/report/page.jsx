"use client";
import dynamic from "next/dynamic";

import Report from "@/components/admin/admin-dashboard/report";

const index = () => {
  return (
    <>
      <Report />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
