"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  PlusIcon,
  FileIcon,
  PlusCircledIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import { DropdownMenuDemo } from "./dropdownmenu";
import { useRouter } from "next/navigation";
import userStore from "../../store/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { team } from "../../types";
import { Group } from "@radix-ui/react-dropdown-menu";
import { Check, CheckCheckIcon, DoorClosed } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

const inviteSchema = z.object({
  id: z.string().uuid({ message: "Invalid id" }),
});

function menubar() {
  const route = useRouter();
  const [card, setCard] = useState<team | null>(null);

  const user = userStore((state) => state.user);
  const team = userStore((state) => state.currentTeamIndex);

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof inviteSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    const resp = await fetch("https://basel-ru5b.vercel.app/team/invite/user", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamId: values.id }),
    });

    const data: { data: team } = await resp.json();
    if (data.data) {
      setCard(data.data);
    }
  }


  const handleAddUserToTeam = async () => {
         
    const userData = {
      name:user?.name,
      id:user?._id
    }
    const teamData = {
      teamId:card?.teamId,
      teamName:card?.teamName
    }

    const resp = await fetch("https://basel-ru5b.vercel.app/team/add/user",{
      method:'POST',
      credentials:'include',
      headers:{
        'Content-Type':'application/json'     
      },
      body:JSON.stringify({user:userData,team:teamData})
    })

    const data = await resp.json()


    if(data.status === 'ok'){
      sessionStorage.clear()
      location.reload()
    }

  }

  return (
    <div className="flex  justify-around flex-col  items-center  ">
     
      <div className="w-1/3 p-2 ">
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
        <AlertDialog>
          <AlertDialogTrigger asChild className="my-2">
            <Button
              variant="outline"
              className="w-full text-start flex justify-start items-center cursor-pointer"
            >
              Add new team
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="transition-all">
            <AlertDialogHeader>
              <AlertDialogTitle>Add new group by invite</AlertDialogTitle>
              <AlertDialogDescription>
                If you had a link for a team,paste it on the field bellow to be
                able to enter the team.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Paste the team id here"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
{card ? (
              <Card className="transition-all">
                <CardHeader>
                  <CardTitle>{card.teamName}</CardTitle>
                  <CardDescription>Team ID:{card.invite_link}</CardDescription>
                </CardHeader>
              
                <CardFooter>
                  <Button onClick={()=>{
                    handleAddUserToTeam()
                  }}>Enter team</Button>
                </CardFooter>
              </Card>
            ) : (
              ""
            )}
                <AlertDialogFooter className="justify-start sm:justify-start">
                  <Button type="submit">Find team</Button>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </form>
            </Form>
            
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="w-1/3 p-3">
        <div className="w-full flex items-center justify-center my-4 p-2">
        
        </div>
       
      </div>
    </div>
  );
}

export default menubar;


/*  <svg
            width="353"
            height="90"
            viewBox="0 0 353 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M95.5121 64.7049C92.506 64.7049 89.8221 63.9749 87.4601 62.5148C85.0982 61.0547 83.2302 59.0578 81.856 56.5241C80.4818 53.9904 79.7947 51.1132 79.7947 47.8924C79.7947 44.6716 80.4818 41.8159 81.856 39.3251C83.2302 36.7914 85.0982 34.816 87.4601 33.3989C89.8221 31.9388 92.506 31.2087 95.5121 31.2087C97.917 31.2087 100.021 31.6597 101.825 32.5615C103.628 33.4633 105.089 34.7301 106.205 36.362V19.8042H114.45V63.9319H107.107L106.205 59.3584C105.174 60.7756 103.8 62.0209 102.083 63.0945C100.408 64.1681 98.2176 64.7049 95.5121 64.7049ZM97.2513 57.4904C99.9139 57.4904 102.083 56.61 103.757 54.8493C105.475 53.0457 106.334 50.7482 106.334 47.9568C106.334 45.1655 105.475 42.8895 103.757 41.1288C102.083 39.3251 99.9139 38.4233 97.2513 38.4233C94.6318 38.4233 92.4631 39.3037 90.7453 41.0643C89.0276 42.825 88.1687 45.1011 88.1687 47.8924C88.1687 50.6838 89.0276 52.9813 90.7453 54.7849C92.4631 56.5885 94.6318 57.4904 97.2513 57.4904Z"
              fill="url(#paint0_linear_1119_260)"
            />
            <path
              d="M135.799 64.7049C132.578 64.7049 129.723 64.0178 127.232 62.6436C124.741 61.2694 122.787 59.3369 121.37 56.8462C119.953 54.3555 119.244 51.4782 119.244 48.2145C119.244 44.9078 119.932 41.9662 121.306 39.3895C122.723 36.8129 124.655 34.816 127.103 33.3989C129.594 31.9388 132.514 31.2087 135.864 31.2087C138.999 31.2087 141.768 31.8958 144.173 33.27C146.578 34.6442 148.446 36.5338 149.777 38.9386C151.152 41.3005 151.839 43.9416 151.839 46.8618C151.839 47.3341 151.817 47.828 151.774 48.3433C151.774 48.8587 151.753 49.3954 151.71 49.9537H127.425C127.597 52.4445 128.456 54.3984 130.002 55.8155C131.591 57.2327 133.502 57.9413 135.735 57.9413C137.41 57.9413 138.805 57.5762 139.922 56.8462C141.081 56.0732 141.94 55.0855 142.499 53.8831H150.873C150.271 55.9014 149.262 57.748 147.845 59.4228C146.471 61.0547 144.753 62.343 142.692 63.2878C140.673 64.2325 138.376 64.7049 135.799 64.7049ZM135.864 37.908C133.845 37.908 132.063 38.4877 130.517 39.6472C128.971 40.7637 127.984 42.4815 127.554 44.8005H143.465C143.336 42.6962 142.563 41.0214 141.146 39.776C139.729 38.5307 137.968 37.908 135.864 37.908Z"
              fill="url(#paint1_linear_1119_260)"
            />
            <path
              d="M156.202 63.9319V31.9817H163.481L164.125 37.3926C165.113 35.5031 166.53 34.0001 168.377 32.8836C170.266 31.767 172.478 31.2087 175.012 31.2087C178.962 31.2087 182.033 32.4541 184.223 34.9449C186.413 37.4356 187.508 41.0858 187.508 45.8955V63.9319H179.263V46.6685C179.263 43.9201 178.705 41.8159 177.588 40.3558C176.472 38.8957 174.732 38.1656 172.37 38.1656C170.051 38.1656 168.14 38.9816 166.637 40.6134C165.177 42.2453 164.447 44.5213 164.447 47.4415V63.9319H156.202Z"
              fill="url(#paint2_linear_1119_260)"
            />
            <path
              d="M195.393 63.9319V31.9817H202.672L203.38 36.2976C204.411 34.7516 205.763 33.5277 207.438 32.6259C209.156 31.6811 211.131 31.2087 213.365 31.2087C218.303 31.2087 221.803 33.1197 223.864 36.9417C225.024 35.181 226.57 33.7854 228.502 32.7547C230.478 31.7241 232.625 31.2087 234.944 31.2087C239.109 31.2087 242.309 32.4541 244.542 34.9449C246.775 37.4356 247.891 41.0858 247.891 45.8955V63.9319H239.646V46.6685C239.646 43.9201 239.109 41.8159 238.036 40.3558C237.005 38.8957 235.395 38.1656 233.205 38.1656C230.971 38.1656 229.168 38.9816 227.794 40.6134C226.462 42.2453 225.797 44.5213 225.797 47.4415V63.9319H217.552V46.6685C217.552 43.9201 217.015 41.8159 215.941 40.3558C214.868 38.8957 213.214 38.1656 210.981 38.1656C208.791 38.1656 207.009 38.9816 205.635 40.6134C204.303 42.2453 203.638 44.5213 203.638 47.4415V63.9319H195.393Z"
              fill="url(#paint3_linear_1119_260)"
            />
            <path
              d="M264.163 64.7049C261.415 64.7049 259.16 64.2755 257.399 63.4166C255.639 62.5148 254.329 61.3338 253.47 59.8737C252.611 58.4137 252.182 56.8033 252.182 55.0426C252.182 52.0794 253.341 49.6746 255.66 47.828C257.979 45.9814 261.458 45.0581 266.095 45.0581H274.212V44.2851C274.212 42.095 273.589 40.4846 272.344 39.454C271.098 38.4233 269.552 37.908 267.706 37.908C266.031 37.908 264.571 38.3159 263.326 39.1319C262.08 39.9049 261.307 41.0643 261.007 42.6103H252.955C253.169 40.2914 253.942 38.273 255.274 36.5552C256.648 34.8375 258.409 33.5277 260.556 32.6259C262.703 31.6811 265.108 31.2087 267.77 31.2087C272.322 31.2087 275.908 32.3468 278.528 34.6228C281.147 36.8988 282.457 40.1196 282.457 44.2851V63.9319H275.436L274.663 58.7787C273.718 60.4964 272.387 61.9136 270.669 63.0301C268.994 64.1466 266.826 64.7049 264.163 64.7049ZM266.031 58.2633C268.393 58.2633 270.218 57.4904 271.506 55.9444C272.838 54.3984 273.675 52.4874 274.019 50.2114H266.997C264.807 50.2114 263.24 50.6193 262.295 51.4353C261.35 52.2083 260.878 53.1745 260.878 54.334C260.878 55.5794 261.35 56.5456 262.295 57.2327C263.24 57.9198 264.485 58.2633 266.031 58.2633Z"
              fill="url(#paint4_linear_1119_260)"
            />
            <path
              d="M290.325 63.9319V31.9817H297.669L298.442 37.9724C299.601 35.9111 301.169 34.2792 303.144 33.0768C305.162 31.8314 307.524 31.2087 310.23 31.2087V39.9049H307.911C306.107 39.9049 304.497 40.184 303.08 40.7423C301.663 41.3005 300.546 42.2668 299.73 43.641C298.957 45.0152 298.571 46.9262 298.571 49.374V63.9319H290.325Z"
              fill="url(#paint5_linear_1119_260)"
            />
            <path
              d="M313.294 63.9319V19.8042H321.539V44.9293L332.876 31.9817H342.667L329.591 46.5397L344.793 63.9319H334.487L321.539 47.8924V63.9319H313.294Z"
              fill="url(#paint6_linear_1119_260)"
            />
            <path
              d="M46.6627 10.2856H14.1583V20.5607H46.6627C51.2955 20.5607 55.0512 24.3164 55.0512 28.9493V56.0015C55.0512 60.6344 51.2955 64.3901 46.6627 64.3901H14.1583V74.6652H46.6627C56.9703 74.6652 65.3263 66.3092 65.3263 56.0015V28.9493C65.3263 18.6416 56.9703 10.2856 46.6627 10.2856Z"
              fill="white"
            />
            <path
              d="M46.6627 10.2856H14.1583V20.5607H46.6627C51.2955 20.5607 55.0512 24.3164 55.0512 28.9493V56.0015C55.0512 60.6344 51.2955 64.3901 46.6627 64.3901H14.1583V74.6652H46.6627C56.9703 74.6652 65.3263 66.3092 65.3263 56.0015V28.9493C65.3263 18.6416 56.9703 10.2856 46.6627 10.2856Z"
              fill="url(#paint7_linear_1119_260)"
            />
            <path
              d="M45.1937 30.5792L37.9124 23.3294L14.3737 46.9701L7.28129 39.847L0 47.0969L14.3737 61.5328L45.1937 30.5792Z"
              fill="white"
            />
            <path
              d="M45.1937 30.5792L37.9124 23.3294L14.3737 46.9701L7.28129 39.847L0 47.0969L14.3737 61.5328L45.1937 30.5792Z"
              fill="url(#paint8_linear_1119_260)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1119_260"
                x1="79.7947"
                y1="64.7049"
                x2="280.712"
                y2="142.1"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.28125" stop-color="#FF6C35" />
                <stop offset="1" stop-color="#FAD370" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1119_260"
                x1="79.7947"
                y1="64.7049"
                x2="280.712"
                y2="142.1"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.28125" stop-color="#FF6C35" />
                <stop offset="1" stop-color="#FAD370" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1119_260"
                x1="79.7947"
                y1="64.7049"
                x2="280.712"
                y2="142.1"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.28125" stop-color="#FF6C35" />
                <stop offset="1" stop-color="#FAD370" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_1119_260"
                x1="79.7947"
                y1="64.7049"
                x2="280.712"
                y2="142.1"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.28125" stop-color="#FF6C35" />
                <stop offset="1" stop-color="#FAD370" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_1119_260"
                x1="79.7947"
                y1="64.7049"
                x2="280.712"
                y2="142.1"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.28125" stop-color="#FF6C35" />
                <stop offset="1" stop-color="#FAD370" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_1119_260"
                x1="79.7947"
                y1="64.7049"
                x2="280.712"
                y2="142.1"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.28125" stop-color="#FF6C35" />
                <stop offset="1" stop-color="#FAD370" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_1119_260"
                x1="79.7947"
                y1="64.7049"
                x2="280.712"
                y2="142.1"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.28125" stop-color="#FF6C35" />
                <stop offset="1" stop-color="#FAD370" />
              </linearGradient>
              <linearGradient
                id="paint7_linear_1119_260"
                x1="59.1429"
                y1="67.3761"
                x2="-10.2857"
                y2="17.2332"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FA709A" />
                <stop offset="1" stop-color="#FEE140" />
              </linearGradient>
              <linearGradient
                id="paint8_linear_1119_260"
                x1="59.1429"
                y1="67.3761"
                x2="-10.2857"
                y2="17.2332"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FA709A" />
                <stop offset="1" stop-color="#FEE140" />
              </linearGradient>
            </defs>
          </svg> */