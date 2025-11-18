"use client";
import dynamic from "next/dynamic";

import Payments from "@/components/admin/admin-dashboard/payments";

const index = () => {
  return (
    <>
      <Payments />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
