"use client";
import React from "react";
import { useState, useEffect } from "react";
import { sessionApiCall } from "../types";
export default function useGetCurrentUser() {
  const [data, setData] = useState<sessionApiCall | null >(null);

  useEffect(() => {
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

        setData(resp);
      
    }
    getData();
  }, []);

  return data
}
