"use client";
import dynamic from "next/dynamic";
import ListSurvey from "@/components/admin/admin-dashboard/listsurvey";

const index = () => {
  return (
    <>
      <ListSurvey />
    </>
  );
};


export default dynamic(() => Promise.resolve(index), { ssr: false });