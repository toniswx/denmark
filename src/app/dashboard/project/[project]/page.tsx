"use client";
import { useEffect } from "react";
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

function page() {
  const route = useRouter()
  const currentTeam = teamStore();

  return (
    <div className=" w-full flex items-center justify-center   ">
    {currentTeam.currentTeam === null ? (
        "load"
      ) : (
        <div className="flex w-9/12 items-center justify-center pt-20 ">
          <Tabs defaultValue="open" className="w-9/12 h-full">
            <TabsList>
              <TabsTrigger value="open">Current open issues</TabsTrigger>
              <TabsTrigger value="closed">Closed issues</TabsTrigger>
            </TabsList>
            <TabsContent value="open">
              <ScrollArea className=" rounded-md border p-4 w-full">
                <Table>
                  <TableCaption>A list of your recent tasks.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-fit">Status</TableHead>
                      <TableHead className="w-fit">Method</TableHead>
                      <TableHead className="w-full">Task</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTeam.currentTeam.tasks.map((task) => (
                      <TableRow key={task.id} className="cursor-pointer" onClick={()=>{
                        route.push("/workspace/task/"+task.id)
                      }}>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>{task.priority}</TableCell>
                        <TableCell className="font-medium line-clamp-1 h-9">
                          {task.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableBody></TableBody>
                  <TableFooter></TableFooter>
                </Table>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="closed">
              <Table>
                <TableCaption>A list of your recent tasks.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-fit">Status</TableHead>
                    <TableHead className="w-fit">Method</TableHead>
                    <TableHead className="w-full">Task</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTeam.currentTeam.closed_tasks.length === 0
                    ? ""
                    : currentTeam.currentTeam.closed_tasks.map((task) => (
                        <TableRow key={task.id} className="cursor-pointer">
                          <TableCell>{task.status}</TableCell>
                          <TableCell>{task.priority}</TableCell>
                          <TableCell className="font-medium line-clamp-1 h-9">
                            {task.description}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
                <TableBody></TableBody>
                <TableFooter></TableFooter>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default page;


