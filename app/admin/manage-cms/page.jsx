"use client";
import dynamic from "next/dynamic";
import ManageCms from "@/components/admin/admin-dashboard/manage-cms";

const index = () => {
  return (
    <>
      <ManageCms />
    </>
  );
};
export default dynamic(() => Promise.resolve(index), { ssr: false });
