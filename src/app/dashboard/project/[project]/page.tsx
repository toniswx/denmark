"use client";
import { useEffect, useState } from "react";
import React from "react";
import teamStore from "../../../../../store/project";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { DropdownMenuDemo } from "@/components/dropdownmenu";
import NewTask from "@/components/newtaskcomp";
import * as copy from "copy-to-clipboard";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { task } from "../../../../../types";
import { Separator } from "@/components/ui/separator";
import userStore from "../../../../../store/user";
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
import { ExitIcon } from "@radix-ui/react-icons";
import { Copy } from "lucide-react";
function page() {
  const currentTeam = teamStore();
  const searchByIdRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<string[] | [] | undefined>([]);
  const [findTaskById, setTaskById] = useState<null | string>(null);
  const [allTasks, setAllTasks] = useState<task[] | undefined>(openTasks);

  useEffect(() => {
    const uniqueList = currentTeam.currentTeam?.tasks.reduce(
      (acc: string[], current) => {
        const isDuplicate = acc.some((item) => item === current.status);
        if (!isDuplicate) {
          acc.push(current.status);
        }
        return acc;
      },
      []
    );

    setFilters(uniqueList);
  }, []);

  const closedTasks = currentTeam.currentTeam?.tasks.filter(
    (task) => task.status === "Closed"
  );
  var openTasks = currentTeam.currentTeam?.tasks.filter(
    (task) => task.status !== "Closed"
  );
  const todoTasks = currentTeam.currentTeam?.tasks.filter(
    (task) => task.status === "To-do"
  );
  const onGoindTasks = currentTeam.currentTeam?.tasks.filter(
    (task) => task.status === "On-going"
  );
  const completedTasks = currentTeam.currentTeam?.tasks.filter(
    (task) => task.status === "Completed"
  );

  useEffect(() => {
    if (findTaskById !== null) {
      const tasks = currentTeam.currentTeam?.tasks.filter((task) =>
        task.id.match(findTaskById)
      );
      if (tasks !== undefined) {
        setAllTasks(tasks);
      }
    } else {
      setAllTasks(openTasks);
    }
  }, [findTaskById]);

  const store = userStore();
  const team = teamStore();

  const deleteUserFromTeam = async () => {
    const teamId = team.currentTeam?.teamId;
    const userId = store.user?._id;

    try {
      const resp = await fetch("https://basel-ru5b.vercel.app/team/deleteUser", {
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
    <div className="   flex items-center justify-center w-full   ">
      {currentTeam.currentTeam === null ? (
        "load"
      ) : (
        <div className="flex items-center justify-center w-full  flex-col  lg:p-20 p-5">
          <div className="w-full md:hidden flex items-start justify-between   mb-10 ">
            <div className="flex items-center justify-start space-x-2">
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
            <div className=" ">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button className="mx-2 w-full " asChild>
                    <Button size={"icon"}>
                      <ExitIcon />
                    </Button>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-8/12">
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

          <div className="flex items-start justify-start w-full">
            <h2 className="p-2 font-bold text-3xl">
              {currentTeam.currentTeam.teamName}
            </h2>
          </div>
          <Tabs defaultValue="open" className="w-full h-full">
            <TabsList className="bg-transparent flex flex-col h-full w-full items-center justify-center space-y-3 md:space-y-0 md:flex-row md:justify-start md:items-center  ">
              <TabsTrigger value="open" className="w-full md:w-fit">
                All open tasks
              </TabsTrigger>
              <>
                {filters?.map((s) => {
                  return (
                    <TabsTrigger value={s} className="w-full md:w-fit">
                      {s}
                    </TabsTrigger>
                  );
                })}
              </>
              <Separator className="w-full my-2 md:w-0  " />
              <div className="flex items-center justify-center">
                <NewTask />
                <Input
                  ref={searchByIdRef}
                  type="text"
                  placeholder="Search tasks by ID"
                  className="ml-2 w-full md:w-fit"
                  onChange={() => {
                    setTaskById(searchByIdRef?.current!.value);
                  }}
                />
              </div>
            </TabsList>
            <TabsContent value="open">
              <ScrollArea className=" rounded-md s p-4 w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="">
                      <TableHead className="w-[100px] hidden md:block ">
                        Task id
                      </TableHead>

                      <TableHead className="w-[100px]">Urgency</TableHead>
                      <TableHead className="">Task</TableHead>
                      <TableHead className="w-[100px] hidden md:block">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTasks?.map((task, _index) => (
                      <TableRow
                        key={task.id}
                        className="cursor-pointer"
                        onClick={() => {
                          route.push("/workspace/task/" + task.id);
                        }}
                      >
                        <TableCell className="font-semibold hidden md:block">
                          #{task.id.slice(0, 6)}
                        </TableCell>

                        <TableCell>{task.priority}</TableCell>
                        <TableCell className="">{task.title}</TableCell>
                        <TableCell className="hidden md:block">
                          {task.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="Closed">
              <ScrollArea className=" rounded-md s p-4 w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Task id</TableHead>

                      <TableHead className="w-[100px]">Urgency</TableHead>
                      <TableHead className="">Task</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTasks !== undefined
                      ? allTasks?.map((task, _index) => (
                          <TableRow
                            key={task.id}
                            className="cursor-pointer"
                            onClick={() => {
                              route.push("/workspace/task/" + task.id);
                            }}
                          >
                            <TableCell className="font-semibold">
                              #{task.id.slice(0, 6)}
                            </TableCell>

                            <TableCell>{task.priority}</TableCell>
                            <TableCell className="">{task.title}</TableCell>
                            <TableCell>{task.status}</TableCell>
                          </TableRow>
                        ))
                      : closedTasks?.map((task, _index) => (
                          <TableRow
                            key={task.id}
                            className="cursor-pointer"
                            onClick={() => {
                              route.push("/workspace/task/" + task.id);
                            }}
                          >
                            <TableCell className="font-semibold">
                              #{task.id.slice(0, 6)}
                            </TableCell>

                            <TableCell>{task.priority}</TableCell>
                            <TableCell className="">{task.title}</TableCell>
                            <TableCell>{task.status}</TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="On-going">
              <ScrollArea className=" rounded-md s p-4 w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="">
                      <TableHead className="w-[100px] hidden md:block ">
                        Task id
                      </TableHead>

                      <TableHead className="w-[100px]">Urgency</TableHead>
                      <TableHead className="">Task</TableHead>
                      <TableHead className="w-[100px] hidden md:block">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTasks !== undefined
                      ? allTasks?.map((task, _index) => (
                          <TableRow
                            key={task.id}
                            className="cursor-pointer"
                            onClick={() => {
                              route.push("/workspace/task/" + task.id);
                            }}
                          >
                            <TableCell className="font-semibold hidden md:block">
                              #{task.id.slice(0, 6)}
                            </TableCell>

                            <TableCell>{task.priority}</TableCell>
                            <TableCell className="">{task.title}</TableCell>
                            <TableCell className="hidden md:block">
                              {task.status}
                            </TableCell>
                          </TableRow>
                        ))
                      : onGoindTasks?.map((task, _index) => (
                          <TableRow
                            key={task.id}
                            className="cursor-pointer"
                            onClick={() => {
                              route.push("/workspace/task/" + task.id);
                            }}
                          >
                            <TableCell className="font-semibold hidden md:block">
                              #{task.id.slice(0, 6)}
                            </TableCell>

                            <TableCell>{task.priority}</TableCell>
                            <TableCell className="">{task.title}</TableCell>
                            <TableCell className="hidden md:block">
                              {task.status}
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="To-do">
              <ScrollArea className=" rounded-md s p-4 w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="">
                      <TableHead className="w-[100px] hidden md:block ">
                        Task id
                      </TableHead>

                      <TableHead className="w-[100px]">Urgency</TableHead>
                      <TableHead className="">Task</TableHead>
                      <TableHead className="w-[100px] hidden md:block">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTasks !== undefined
                      ? allTasks?.map((task, _index) => (
                          <TableRow
                            key={task.id}
                            className="cursor-pointer"
                            onClick={() => {
                              route.push("/workspace/task/" + task.id);
                            }}
                          >
                            <TableCell className="font-semibold hidden md:block">
                              #{task.id.slice(0, 6)}
                            </TableCell>

                            <TableCell>{task.priority}</TableCell>
                            <TableCell className="">{task.title}</TableCell>
                            <TableCell className="hidden md:block">
                              {task.status}
                            </TableCell>
                          </TableRow>
                        ))
                      : todoTasks?.map((task, _index) => (
                          <TableRow
                            key={task.id}
                            className="cursor-pointer"
                            onClick={() => {
                              route.push("/workspace/task/" + task.id);
                            }}
                          >
                            <TableCell className="font-semibold hidden md:block">
                              #{task.id.slice(0, 6)}
                            </TableCell>

                            <TableCell>{task.priority}</TableCell>
                            <TableCell className="">{task.title}</TableCell>
                            <TableCell className="hidden md:block">
                              {task.status}
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="Completed">
              <ScrollArea className=" rounded-md s p-4 w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="">
                      <TableHead className="w-[100px] hidden md:block ">
                        Task id
                      </TableHead>

                      <TableHead className="w-[100px]">Urgency</TableHead>
                      <TableHead className="">Task</TableHead>
                      <TableHead className="w-[100px] hidden md:block">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTasks !== undefined
                      ? allTasks?.map((task, _index) => (
                          <TableRow
                            key={task.id}
                            className="cursor-pointer"
                            onClick={() => {
                              route.push("/workspace/task/" + task.id);
                            }}
                          >
                            <TableCell className="font-semibold hidden md:block">
                              #{task.id.slice(0, 6)}
                            </TableCell>

                            <TableCell>{task.priority}</TableCell>
                            <TableCell className="">{task.title}</TableCell>
                            <TableCell className="hidden md:block">
                              {task.status}
                            </TableCell>
                          </TableRow>
                        ))
                      : completedTasks?.map((task, _index) => (
                          <TableRow
                            key={task.id}
                            className="cursor-pointer"
                            onClick={() => {
                              route.push("/workspace/task/" + task.id);
                            }}
                          >
                            <TableCell className="font-semibold hidden md:block">
                              #{task.id.slice(0, 6)}
                            </TableCell>

                            <TableCell>{task.priority}</TableCell>
                            <TableCell className="">{task.title}</TableCell>
                            <TableCell className="hidden md:block">
                              {task.status}
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default page;
