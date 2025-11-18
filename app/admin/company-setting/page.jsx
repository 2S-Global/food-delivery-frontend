"use client";
import dynamic from "next/dynamic";

import CompanySetting from "@/components/admin/admin-dashboard/company-setting";

const index = () => {
  return (
    <>
      <CompanySetting />
    </>
  );
};
export default dynamic(() => Promise.resolve(index), { ssr: false });
