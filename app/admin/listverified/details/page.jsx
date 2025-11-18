"use client";
import dynamic from "next/dynamic";
import ShortlistedResumes from "@/components/admin/admin-dashboard/listverified/details";

const index = () => {
  return (
    <>
      <ShortlistedResumes />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
