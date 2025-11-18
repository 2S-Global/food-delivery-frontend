"use client";
import dynamic from "next/dynamic";
import DashboadHome from "@/components/admin/admin-dashboard/dashboard";

const index = () => {
  return (
    <>
      <DashboadHome />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
