"use client";

import React, { useEffect, useState } from "react";
import { ProgressDemo } from "@/components/progress";
import useGetCurrentUser from "../../../../hooks/useGetCurrentUse";
import { useRouter } from "next/navigation";
import { sessionApiCall, team } from "../../../../types";
import LoadingToast from "@/components/ui/toast-custom";
import Menubar from "@/components/menubar";
import getCurrentUserLIB from "@/lib/getTeam";
import userStore from "../../../../store/user";
import loadStore from "../../../../store/load";
import teamStore from "../../../../store/project";

function layout({ children }: { children: React.ReactNode }) {  

  const router = useRouter();
  const [userData, status] = useGetCurrentUser();
  const globalLoad = loadStore();
  const store = teamStore();
  const projectIndex = userStore((state) => state.currentTeamIndex);

  
  useEffect(() => {
    if (status === "success") {
      if (userData) {

        if (userData.teams.length === 0) {
          router.push("/team/create");
        } else {
               globalLoad.setLoad()
        }
      }
    } else if (status === "error") {
      router.push("/login");
    }
  }, [status, projectIndex]);



  const getProject = async (id: string) => {
   
      
    }

  

  return (
    <div className="h-screen w-full flex items-center justify-start">
      {globalLoad.load  === false ? (
        <>
        
          {children}
        </>
      ) : (
        <div className="">
         
          <div className=" flex items-center justify-center">
            <LoadingToast />
          </div>
        </div>
      )
      }
    </div>
  );
}

export default layout;