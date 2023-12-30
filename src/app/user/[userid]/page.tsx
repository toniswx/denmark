"use client";
import React, { useEffect, useState } from "react";
import { AvatarIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
function page({ params }: { params: { userid: string } }) {
  const [data, setData] = useState<{ name: string; bio: string } | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3030/user/${params.userid}`, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data.resp);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);



  return (
    <div>
      {data === null ? (
        "Loading..."
      ) : (
        
        <div className="flex items-center justify-center w-full h-screen space-x-36">
          <div className="w-1/4 flex items-start justify-start flex-col  border rounded-md p-10">
            <div className="flex items-center justify-start space-x-3 w-full">
              <AvatarIcon className="w-6 h-6" />
              <h2 className="font-bold text-lg">{data.name}</h2>
            </div>
            <Separator className="my-3" />
            <p className="my-1 text-sm text-muted-foreground ">
              {data?.bio ? data?.bio : "No bio provided."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
