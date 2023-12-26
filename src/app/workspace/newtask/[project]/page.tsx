"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from 'uuid';import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import userStore from "../../../../../store/user";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const newTaskSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  priority: z.enum(["High", "Medium", "Low", "Urgent", "Important", "Normal"]),
});

import { ImportIcon } from "lucide-react";
import { task } from "../../../../../types";
import { Separator } from "@/components/ui/separator";
import { randomUUID } from "crypto";
import { useRouter } from "next/navigation";

function page({ params }: { params: { project: string } }) {


  const [quickVewTask, setQuickVewTask] = useState<task | null>(null);
  const user = userStore((state) => state.user);
  const team = userStore((state) => state.currentTeamIndex);

  const [load, setLoad] = useState(false);

  const taskPriorities = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
    { value: "Urgent", label: "Urgent" },
    { value: "Important", label: "Important" },
    { value: "Normal", label: "Normal" },
  ];

   const route = useRouter()

  const form = useForm<z.infer<typeof newTaskSchema>>({
    resolver: zodResolver(newTaskSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof newTaskSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    handleClientScriptLoad();


    if (user !== null) {
      const T = values.priority;
      const newTask: task = {
        createdBy:{
          name:user.name,
          id:user.id,
          time:new Date()
        },
        id: uuidv4(),
        title: values.title,
        description: values.description,
        priority: T,
        status: "To-do",
        comments: [],
        admins: [],
        teamId:user.teams[team].teamId,
        feed:[{id:uuidv4(),action:'Opened this issue',time:new Date(),name:user.name}]

      };

      handleCreateNewTask(newTask);
    }
  }

  const handleClientScriptLoad = () => {
    setLoad(true);
  };

  const handleCreateNewTask = async (task: task) => {
    console.log("oi");
  
    try {
      const resp = await fetch("http://localhost:3030/team/newtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: task, teamId: params.project }),
      });
  
      if (!resp.ok) {
        throw new Error(`HTTP error! Status: ${resp.status}`);
      }
  
      
    setTimeout(() => {
      route.push("/dashboard/project/"+params.project)
    }, 1000);
  
      
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="flex items-center justify-center w-full h-full flex-row space-x-10">
      <div className="w-1/3 transition-all">
        <div className="w-full p-2 my-4 space-y-3">
          <h2 className="text-3xl font-bold space-y-3 ">Create a new task</h2>
          <p className="text-xs text-muted-foreground ">
            Craft your task with precision. Define a title, set its priority,
            and articulate a clear description for seamless task management.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" w-full flex items-center justify-center flex-col "
          >
            <div className="w-full p-2 flex items-center justify-normal space-x-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Task title</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="w-96">
                    <FormLabel>Priority</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {taskPriorities.map((p) => {
                          return (
                            <SelectItem value={p.value}>{p.label}</SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full p-2 ">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex items-start justify-start p-2">
              <Button
                disabled={load ? true : false}
                type="submit"
                className="w-fit"
              >
                {load ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait{" "}
                  </>
                ) : (
                  "Submit new task"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default page;
