"use client";
import dynamic from "next/dynamic";
import ListAdditionalItems from "@/components/admin/admin-dashboard/additional-Items"
import ManageBlog from "@/components/admin/admin-dashboard/manage-blogs";

const index = () => {
  return (
    <>
      {/* <ListAdditionalItems /> */}
      <ManageBlog />
    </>
  );
};
export default dynamic(() => Promise.resolve(index), { ssr: false });
