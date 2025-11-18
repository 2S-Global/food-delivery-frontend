"use client";
import dynamic from "next/dynamic";

import ListPackage from "@/components/admin/admin-dashboard/listverified";

const index = () => {
  return (
    <>
      <ListPackage />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
