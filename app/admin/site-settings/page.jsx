"use client";
import dynamic from "next/dynamic";
import SiteSettingProfile from "@/components/admin/admin-dashboard/site-setting-profile";

const index = () => {
  return (
    <>
      <SiteSettingProfile />
    </>
  );
};
export default dynamic(() => Promise.resolve(index), { ssr: false });
