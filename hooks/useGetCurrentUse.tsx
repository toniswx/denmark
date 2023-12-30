"use client";
import React from "react";
import { useState, useEffect } from "react";
import { ApiResponse, sessionApiCall, user } from "../types";
import userStore from "../store/user";

export default function useGetCurrentUser() {
  const currentUserData = userStore((state) => state.user);
  const setCurrentUser = userStore((state) => state.setCurrentUser);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");



  useEffect(() => {
    setStatus("loading");
    async function getData() {
      const getUserData = await fetch(
        "https://basel-ru5b.vercel.app/user/get/current",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resp: sessionApiCall<user> = await getUserData.json();

      setCurrentUser(resp);

      setStatus("success");
    }

    if (currentUserData === null) {
      getData();
    } else {
      setStatus("success");
    }
  }, []);



  return [currentUserData, status] as const;
}

/*const [data, setData] = useState<sessionApiCall | null >(null);

  



  useEffect(() => { 

    if(currentUserData === null){

      getData()
    }
    else{
      setData({data:currentUserData,message:"",status:"success"})
    }

    async function getData() {
      const getUserData = await fetch(
        "http://localhost:3030/get-current-user",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resp: sessionApiCall = await getUserData.json();
         
      setCurrentUser(resp.data)
      
    }
    getData();
  }, []); */
