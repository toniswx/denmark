"use client";
import React, { useEffect, useState } from "react";
import { ProgressDemo } from "@/components/progress";
import useGetCurrentUser from "../../../hooks/useGetCurrentUse";
import { useRouter } from "next/navigation";
import { sessionApiCall } from "../../../types";

import Menubar from "@/components/menubar";
function layout({ children }: { children: React.ReactNode }) {
  const [load, setLoad] = useState<boolean>(true);

  const router = useRouter();
  const userData = useGetCurrentUser();

  useEffect(() => {
    if (userData) {
      setLoad(false);
    } else {
      router.push("/login");
    }
  }, [userData]);

  return (
    <div className="h-screen w-full flex items-center justify-start">
      {load === false ? (
        <>{children}</>
      ) : (
        <div className="w-full h-screen flex items-center justify-center flex-col absolute ">
 
        </div>
      )}
    </div>
  );
}

export default layout;
