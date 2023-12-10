"use client";
import React, { useEffect } from "react";
import { ProgressDemo } from "@/components/progress";
import useGetCurrentUser from "../../../hooks/useGetCurrentUse";
import { useRouter } from "next/navigation";
import { sessionApiCall } from "../../../types";
function page() {
  const router = useRouter();
  const userData = useGetCurrentUser();

  return (
    <div className="w-1/2 flex items-center justify-center flex-col">
        <h2 className="text-lg font-bold "> HOME PAGE</h2>
    </div>
  );
}

export default page;
