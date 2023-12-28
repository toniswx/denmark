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
function page() {
  const route = useRouter();
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

 
  



  return (
    <div className="   flex items-center justify-center w-full   ">
      {currentTeam.currentTeam === null ? (
        "load"
      ) : (
        <div className="flex items-center justify-center w-full  flex-col   p-20">
          <div className="flex items-start justify-start w-full">
            <h2 className="p-2 font-bold text-3xl">
              {currentTeam.currentTeam.teamName}
            </h2>
          </div>
          <Tabs defaultValue="open" className="w-full h-full">
            <TabsList className="bg-transparent">
              <TabsTrigger value="open">All open tasks</TabsTrigger>
              <>
                {filters?.map((s) => {
                  return <TabsTrigger value={s}>{s}</TabsTrigger>;
                })}
              </>
              <NewTask />
              <Input
                ref={searchByIdRef}
                type="text"
                placeholder="Search tasks by ID"
                className="ml-2"
                onChange={() => {
                  setTaskById(searchByIdRef?.current!.value);
                }}
              />
            </TabsList>
            <TabsContent value="open">
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
                    {allTasks?.map((task, _index) => (
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
                      : onGoindTasks?.map((task, _index) => (
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
            <TabsContent value="To-do">
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
                      : todoTasks?.map((task, _index) => (
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
            <TabsContent value="Completed">
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
                      : completedTasks?.map((task, _index) => (
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
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default page;
