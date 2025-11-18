"use client";
import dynamic from "next/dynamic";

import RegisterForm from "@/components/pages-menu/register";

const index = () => {
  return (
    <>
      <RegisterForm />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
