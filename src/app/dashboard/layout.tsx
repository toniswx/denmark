"use client";
import React, { useEffect, useState } from "react";
import { ProgressDemo } from "@/components/progress";
import useGetCurrentUser from "../../../hooks/useGetCurrentUse";
import { useRouter } from "next/navigation";
import { sessionApiCall, team } from "../../../types";
import LoadingToast from "@/components/ui/toast-custom";
import Menubar from "@/components/menubar";
import getCurrentUserLIB from "@/lib/getTeam";
import userStore from "../../../store/user";
import loadStore from "../../../store/load";
import teamStore from "../../../store/project";
import Navbar from "@/components/navbar";
function layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userData, status] = useGetCurrentUser();
  const globalLoad = loadStore();
  const store = teamStore();
  const projectIndex = userStore((state) => state.currentTeamIndex);

  useEffect(() => {
    if (status === "success") {
      if (userData !== null) {
        if (userData.teams.length === 0) {
          router.push("/team/create");
        } else {
          getProject(userData.teams[projectIndex].teamId);
        }
      } else{
        router.push("/login");

      }
    } else if (status === "error") {
      router.push("/login");
    }

    
  }, [status, projectIndex]);

  const getProject = async (id: string) => {
    const resp = await fetch("http://localhost:3030/team/" + id, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: sessionApiCall<team> = await resp.json();

    if (data) {
      store.setCurrentTeam(data.data);

      globalLoad.setLoad();

      router.push("/dashboard/project/" + id);
    }
    else{
      
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-start">
      {globalLoad.load === false ? (
        <>
          
          <div className="w-full">
            <Navbar />
          </div>
          
          {children}
        </>
      ) : (
        <div className="w-full h-screen flex items-center justify-center flex-col absolute ">
        
          <div className="bottom-0 absolute left-0 m-6">
            <LoadingToast />
          </div>
        </div>
      )}
    </div>
  );
}

export default layout;
