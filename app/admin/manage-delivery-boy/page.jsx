"use client";
import dynamic from "next/dynamic";
import ListCandidate from "@/components/admin/admin-dashboard/listcandidate";

const index = () => {
  return (
    <>
      <ListCandidate />
    </>
  );
};
export default dynamic(() => Promise.resolve(index), { ssr: false });
