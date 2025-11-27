"use client";
import dynamic from "next/dynamic";
import ListAdditionalItems from "@/components/admin/admin-dashboard/additional-Items"

const index = () => {
  return (
    <>
      <ListAdditionalItems />
    </>
  );
};
export default dynamic(() => Promise.resolve(index), { ssr: false });
