"use client";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,

} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import userStore from "../../store/user";
import {
  Copy,
  GroupIcon,
  LogOutIcon,
  LucideGroup,
  Menu,
  ParkingCircleOffIcon,
  Share,
} from "lucide-react";
import { Group } from "@radix-ui/react-dropdown-menu";
import Newteam from "./newteam";
import { useRouter } from "next/navigation";
import teamStore from "../../store/project";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import * as copy from "copy-to-clipboard";
import { Input } from "@/components/ui/input";

function Navbar() {
  const store = userStore();
  const team = teamStore();
 
  const deleteUserFromTeam = async () => {
    const teamId = team.currentTeam?.teamId;
    const userId = store.user?._id;

    try {
      const resp = await fetch("http://localhost:3030/team/deleteUser", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: teamId,
          _id: userId,
          email: store.user!.email,
        }),
      });
      const data = await resp.json();

      if (data.status === 200) {
        location.reload();
      }
    } catch (err) {
      throw err;
    }
  };

  const route = useRouter();
  const { toast } = useToast();
  return (
    <>
      {" "}
      <Sheet>
        <SheetTrigger className="md:hidden border-b w-full text-end px-2 py-2 ">
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle asChild>
              <div className="w-full text-start flex items-center justify-start space-x-4">
            <h2 className="text-lg font-semibold w-full ">{store.user?.name}</h2> 
                
               
                
              </div>
            </SheetTitle>
            <SheetDescription>
               <div>
            <Button className="w-full text-start flex justify-start"
                  onClick={() => {
                    route.push("/workspace/profile");
                  }}
                >
                  <PersonIcon className="mr-3 w-3 h-3" /> Profile
                </Button>
            </div>
            <div className="flex items-center justify-center my-3">
            <Newteam />
            </div>
           
           
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className="md:flex items-center justify-around flex-col hidden  md:flex-row  md:h-14 mb-10 px-10 bg-white border-b ">
        <div className=" h-full  flex items-center justify-between w-full ">
          <div className=" my-2  flex items-center justify-between w-full ">
        
           <div className="items-center space-x-2  hidden md:flex" > 
              <DropdownMenuDemo />
           <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Share</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md ">
                  <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                      Anyone who has this link will be able to view this.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        Link
                      </Label>
                      <Input
                        id="link"
                        defaultValue={team.currentTeam!.teamId}
                        readOnly
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="px-3"
                      onClick={() => {
                        copy(team.currentTeam!.teamId);
                        toast({
                          title: "Team id copied to clipboard",
                          description: new Date().toLocaleString("en-US"),
                        });
                      }}
                    >
                      <span className="sr-only">Copy</span>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
           </div>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button className="mx-2">Leave team</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[470px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    <span className=" mx-1 text-red-500 font-bold">
                      {team.currentTeam?.teamName}
                    </span>{" "}
                    from your account
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteUserFromTeam();
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className=" flex items-center md:justify-center h-full space-x-5 justify-between ">
          <Newteam />

          <Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <AvatarFallback>{store.user?.name[0]}</AvatarFallback>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    route.push("/workspace/profile");
                  }}
                >
                  <PersonIcon className="mr-3 w-3 h-3" /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <LogOutIcon className="mr-3 w-3 h-3" />
                  Logout{" "}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Avatar>
        </div>
      </div>
    </>
  );
}

export default Navbar;
