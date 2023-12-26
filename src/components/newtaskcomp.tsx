"use client";
import React from "react";
import { Button } from "./ui/button";

import { useRouter } from "next/navigation";
import userStore from "../../store/user";

import * as z from "zod";
import { PlusIcon } from "lucide-react";

function NewTask() {
  const route = useRouter();

  const user = userStore((state) => state.user);
  const team = userStore((state) => state.currentTeamIndex);

  return (
    <div className="ml-2">
      <div className=" ">
        <Button
          className="w-full text-start flex justify-start items-center cursor-pointer"
          asChild
          onClick={() => {
            route.push("/workspace/newtask/" + user?.teams[team].teamId);
          }}
        >
          <p>
            Create new task <PlusIcon className="ml-2" />{" "}
          </p>
        </Button>
      </div>
      
    </div>
  );
}

export default NewTask;
