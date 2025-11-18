"use client";
import dynamic from "next/dynamic";

import ChangePassword from "@/components/admin/admin-dashboard/change-password";

const index = () => {
  return (
    <>
      <ChangePassword />
    </>
  );
};
export default dynamic(() => Promise.resolve(index), { ssr: false });
