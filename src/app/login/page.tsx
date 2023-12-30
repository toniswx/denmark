"use client";
import React, { useEffect } from "react";
import LoginForm from "@/components/login-form";
import Image from "next/image";
import useGetCurrentUser from "../../../hooks/useGetCurrentUse";
import { useRouter } from "next/navigation";
import { ProgressDemo } from "@/components/progress";
function page() {
 

  return (
    <div className="h-screen w-full flex items-center justify-center p-20">
        
          <div className="flex items-center h-screen justify-center w-full   ">
            <div className="w-full   rounded-md  ">
              <div className="w-full">
                <h2 className="text-2xl font-bold">Welcome Back 👋 </h2>
                <p className="text-xs text-muted-foreground">
                  Sing in to start manage your projects
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
        
  
    </div>
  );
}

export default page;
