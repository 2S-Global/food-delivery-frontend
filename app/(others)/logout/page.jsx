"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const Logout = () => {
  useEffect(() => {
    // Clear local storage
    localStorage.clear();

    // Redirect to home page
    window.location.href = "/";
  }, []);

  return null; // Nothing will be displayed
};

export default dynamic(() => Promise.resolve(Logout), { ssr: false });
