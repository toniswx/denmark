"use client";
import {
  Cloud,
  CreditCard,
  Github,
  Group,
  Keyboard,
  LifeBuoy,
  Link,
  LogOut,
  Mail,
  MessageSquare,
  PenToolIcon,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  CubeIcon,
  DotFilledIcon,
  DotsHorizontalIcon,
  ExitIcon,
  GearIcon,
  GroupIcon,
  Link1Icon,
  PersonIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useEffect, useState } from "react";

import userStore from "../../store/user";
import { useRouter } from "next/navigation";
import { Close } from "@radix-ui/react-toast";
import { Separator } from "@radix-ui/react-separator";
import { Avatar } from "@radix-ui/react-avatar";
import teamStore from "../../store/project";

export function DropdownMenuDemo() {
  const userData = userStore((state) => state.user);
  const teamIndex = userStore((state) => state.currentTeamIndex);
  const setIndex = userStore((state) => state.setCurrentTeamIndex);
  const [open, setOpen] = useState(false);
  const route = useRouter();
  const team = teamStore((state) => state.currentTeam);

  const handleLogOut = async () => {
    try {
      const res = await fetch("http://localhost:3030/user/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data) {
        sessionStorage.clear();
        route.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (team !== null) {
      team.adm?.find(i=> i._id === userData?._id)
      
    }
  }, [team]);

  const routes = [
    {
      title: "Preferencies",
      icon: <GearIcon className="mr-2 w-4 h-4 " />,
      element: <Preferencies />,
    },
    {
      title: "Members",
      icon: <PersonIcon className="mr-2 w-4 h-4 " />,
      element: <Members />,
    },
  ];

  const [currentRoute, setCurrentRoute] = useState(0);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="p-2 flex items-center pl-5 justify-start"
          >
            {userData?.name} <TriangleDownIcon className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuLabel>Your teams </DropdownMenuLabel>

          <DropdownMenuGroup>
            {userData?.teams.map((team, _index) => {
              return (
                <DropdownMenuItem
                  className="w-full"
                  onClick={() => {
                    setIndex(_index);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{team.teamName}</span>
                  <DropdownMenuShortcut>⌘</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                route.push("/team/create");
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Create new team</span>
            </DropdownMenuItem>
            {team.adm?.find(i=> i._id === userData?._id) ? (
              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                }}
              >
                <PenToolIcon className="mr-2 h-4 w-4" />
                <span>Configure team</span>
              </DropdownMenuItem>
            ) : (
              ""
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Invite users</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Link1Icon className="mr-2 h-5 w-3 opacity-40 " />
                    Copy group link
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              handleLogOut();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent className="w-9/12 h-3/4 flex flex-col space-y-4">
          <AlertDialogHeader className="h-fit">
            <AlertDialogTitle asChild>
              <div className="w-full flex items-center justify-between">
                Manage your team preferencies
                <AlertDialogCancel>
                  <ExitIcon />{" "}
                </AlertDialogCancel>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Navigate through tailored settings to streamline your team's
              communication dynamics.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="h-full flex items-center justify-start border rounded-md">
            <div className="w-[230px] h-full border-r flex items-start flex-col justify-start py-7 space-y-2  p-2">
              {routes.map((route, route_index) => {
                return (
                  <Button
                    onClick={() => {
                      setCurrentRoute(route_index);
                    }}
                    className="w-full text-start flex justify-between items-center cursor-pointer text-xs h-7 "
                    variant={"ghost"}
                  >
                    <div className="flex">
                      {" "}
                      {route.icon}
                      {route.title}
                    </div>
                    {route_index === currentRoute ? (
                      <div className=" w-2 h-2 bg-black rounded-full"></div>
                    ) : (
                      ""
                    )}
                  </Button>
                );
              })}
            </div>
            <div className="w-full h-full  ">
              <ScrollArea className="h-[500px] p-7">
                {routes[currentRoute].element}
              </ScrollArea>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const preferenciesSchema = z.object({
  teamName: z.string().min(5, {
    message: "Team name must be at least 5 characters.",
  }),
});

const Preferencies = (): JSX.Element => {
  const userData = userStore((state) => state.user);
  const teamIndex = userStore((state) => state.currentTeamIndex);
  const setIndex = userStore((state) => state.setCurrentTeamIndex);
  const team = teamStore((state) => state.currentTeam);

  const form = useForm<z.infer<typeof preferenciesSchema>>({
    resolver: zodResolver(preferenciesSchema),
    defaultValues: {
      teamName: team?.teamName,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof preferenciesSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const resp = await fetch("http://localhost:3030/team/config", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          teamId: team?.teamId,
          newTeamName: values.teamName,
          userId: userData?.id,
        },
        action: "changeTeamName",
      }),
    });

    const data = await resp.json();
    if (data.ok === true) {
      sessionStorage.clear();
      location.reload();
    }

    console.log(team);
  }

  const handleDeleteTeam = async () => {
    const resp = await fetch("http://localhost:3030/team/config", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          teamId: team?.teamId,
        },
        action: "deleteTeam",
      }),
    });

    const data = await resp.json();
    if (data.ok === true) {
      sessionStorage.clear();
      location.reload();
    }

    console.log(team);
  };

  return (
    <div className="p-2 space-y-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team name</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-between space-x-4">
                    <Input {...field} className="h-fit " />
                    <Button
                      type="submit"
                      variant={"outline"}
                      size={"default"}
                      className="p-4"
                    >
                      Save
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>Can be changed at any time.</FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="border border-red-600 rounded-md w-full p-5 my-3 space-y-3">
        <div>
          <h2 className="font-semibold text-red-600">Danger Zone</h2>
          <p className="font-medium text-red-600 text-sm">
            Proceed with caution, once completed, these actions cannot be
            undone.
          </p>
        </div>
        <Button
          variant={"destructive"}
          onClick={() => {
            handleDeleteTeam();
          }}
        >
          Delete this team
        </Button>
      </div>
    </div>
  );
};

const Members = (): JSX.Element => {
  const userData = userStore((state) => state.user);
  const teamIndex = userStore((state) => state.currentTeamIndex);
  const setIndex = userStore((state) => state.setCurrentTeamIndex);
  const team = teamStore((state) => state.currentTeam);


  const deleteUserFromTeam = async (id:string) =>{
     
    const teamId = team?.teamId
    const userId = id
    console.log(id)

    try{
     const resp = await fetch("http://localhost:3030/team/deleteUser",{
       method:"POST",
       credentials:"include",
       headers:{
         'Content-Type':'application/json'
       },
       body:JSON.stringify({teamId:teamId,_id:userId,email:userData!.email})
     })
     const data = await resp.json()

     if(data.ok){
      location.reload()
     }
    }
    catch(err){
        throw err
    }
   
 }



  return (
    <div className="w-full ">
      <div className="w-full    overflow-y-hidden  rounded-md p-4 ">
        <h2>Team members</h2>
        <p className="text-sm text-muted-foreground">
          Manage your team members.
        </p>
      </div>
      <div className=" overflow-hidden">
        <Table className="my-2    ">
          <TableBody>
            {team?.users.map((user) => {
              return (
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-start">
                      <CubeIcon className="mr-3 h-5 w-6" /> {user.name}
                    </div>{" "}
                  </TableCell>

                  <TableCell></TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        {" "}
                        <Button size={"icon"} variant={"outline"}>
                          <DotsHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Manage user</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={()=>{
                        deleteUserFromTeam(user._id)
                        }}>Delete user</DropdownMenuItem>

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Privileges
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>
                                Set user as admin
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Reverse admin rights
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
