"use client";
import React, { useEffect, useState } from "react";
import LoginForm from "@/components/login-form";
import Image from "next/image";
import useGetCurrentUser from "../../hooks/useGetCurrentUse";
import { useRouter } from "next/navigation";
import { ProgressDemo } from "@/components/progress";
import LoadingToast from "@/components/ui/toast-custom";

function page() {
  const [load, setLoad] = useState<boolean>(true);

  const router = useRouter();
  const userData = useGetCurrentUser();

  useEffect(() => {
    
      router.push("/login");
    
  }, [userData]);

  return (
    <div className="">
         
    <div className=" flex items-center justify-center">
      <LoadingToast />
    </div>
  </div>
  );
}

export default page;
