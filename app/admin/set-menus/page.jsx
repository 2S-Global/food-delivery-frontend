"use client";

import dynamic from "next/dynamic";

// Lazy load Weekly Menu Page
import WeeklyMenuPage from "@/components/admin/admin-dashboard/weekly-menu"

const Index = () => {
  return (
    <>
      <WeeklyMenuPage />
    </>
  );
};

export default Index;

