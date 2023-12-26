import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ActivityLogIcon, PersonIcon, Share1Icon } from "@radix-ui/react-icons";
import { DropdownMenuDemo } from "./dropdownmenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import userStore from "../../store/user";
import { GroupIcon, LogOutIcon, LucideGroup, ParkingCircleOffIcon, Share } from "lucide-react";
import { Group } from "@radix-ui/react-dropdown-menu";
import Newteam from "./newteam";
function Navbar() {
  const store = userStore();
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Workspaces",
      path: "/workspaces/menu",
    },
  ];

  return (
    <div className="flex items-center justify-around h-14 mb-10 px-10 bg-white border-b">
      <div className=" h-full  flex items-center justify-between w-full ">
        <div className="mx-3  flex items-center justify-evenly ">
          <DropdownMenuDemo />
          
        </div>
      </div>

      <div className=" flex items-center justify-center h-full space-x-5">
      <Newteam />

        <Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>

              
              <AvatarFallback>{store.user?.name[0]}</AvatarFallback>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><PersonIcon className="mr-3 w-3 h-3" /> Profile</DropdownMenuItem>
         
              <DropdownMenuItem><Share1Icon className="mr-3 w-3 h-3" />  Teams</DropdownMenuItem>
              <DropdownMenuItem ><LogOutIcon className="mr-3 w-3 h-3" />Logout </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Avatar>
      </div>
    </div>
  );
}

export default Navbar;
