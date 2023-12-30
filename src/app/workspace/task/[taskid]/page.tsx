"use client";
import React, { use, useEffect, useState } from "react";
import teamStore from "../../../../../store/project";
import { comment, task } from "../../../../../types";
import { Badge } from "@/components/ui/badge";
import LoadingToast from "@/components/ui/toast-custom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { io } from "socket.io-client";
import {
  ArrowDownToDot,
  ArrowUpLeft,
  Edit,
  ListTodo,
  ListTodoIcon,
  MenuIcon,
  MousePointerSquare,
  PointerIcon,
  Reply,
  ReplyIcon,
  Route,
  RouteOffIcon,
} from "lucide-react";
import {
  AvatarIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
  ExitIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import userStore from "../../../../../store/user";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { uuid } from "uuidv4";
import FailSession from "@/components/ui/fail-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Value } from "@radix-ui/react-select";
import useGetCurrentUser from "../../../../../hooks/useGetCurrentUse";
import { useStore } from "zustand";
import { comment } from "postcss";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  comment: z.string().min(1, {
    message: "Comments can't be empty",
  }),
});

const newCommentForm = z.object({
  comment: z.string().min(1, {
    message: "Comments can't be empty",
  }),
});

function page({ params }: { params: { taskid: string } }) {
  const [error, setError] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<task | null>(null);
  const [fieldState, setFieldState] = useState<string>("");
  const [isEditing, setEditing] = useState<{
    edit: boolean;
    index: undefined | number;
  }>({ edit: false, index: undefined });

  const [isReply, setReply] = useState<{
    edit: boolean;
    index: undefined | number;
  }>({ edit: false, index: undefined });
  const team = teamStore((state) => state.currentTeam);

  useEffect(() => {
    setInterval(() => {
      getTask();
    }, 800);
  }, []);

  const [userData, load] = useGetCurrentUser();
  const user = userStore();

  async function getTask() {
    const resp = await fetch(`https://basel-ru5b.vercel.app/tasks/${params.taskid}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await resp.json();

    if (data.data !== "error") {
      setCurrentTask(data.data);
      location.reload()
    } else {
      setError(true);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const form2 = useForm<z.infer<typeof newCommentForm>>({
    resolver: zodResolver(newCommentForm),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const newComment: comment = {
      _id: userData!._id,
      owner: userData!.name,
      text: data.comment,
      id: uuid(),
      date: new Date(),
    };

    addNewComment(newComment);

    form.resetField("comment");
  }

  function onSubmitNewComment(data: z.infer<typeof newCommentForm>) {
    const newComment: comment = {
      _id: userData!._id,
      owner: userData!.name,
      text: data.comment,
      id: uuid(),
      date: new Date(),
    };

    editComment(newComment);

    clearForm();
  }

  async function addNewComment<T>(comment: T) {
    const resp = await fetch(
      `https://basel-ru5b.vercel.app/tasks/addcomment/${params.taskid}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: comment }),
      }
    );
  }

  async function editComment(comment: comment) {
    if (isReply.edit === true) {
      console.log("send");
      const resp = await fetch(
        `https://basel-ru5b.vercel.app/tasks/${params.taskid}/comment`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reply_to: currentTask?.comments[isReply.index!],
            comment: comment,
            action: "reply",
            comment_id: { _id: "" },
          }),
        }
      );

      clearForm();
    } else if (isEditing.edit === true) {
      clearForm();

      const resp = await fetch(
        `http://localhost:3030/tasks/${params.taskid}/comment`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: comment,
            action: "edit",
            comment_id: currentTask?.comments[isEditing.index!],
          }),
        }
      );
    }
  }

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  async function deleteComment(id: string) {
    const resp = await fetch(
      `https://basel-ru5b.vercel.app/tasks/${params.taskid}/comment`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: {},
          action: "delete",
          comment_id: { id: id },
        }),
      }
    );
  }

  const clearForm = () => {
    form2.resetField("comment");
    setEditing({ edit: false, index: undefined });
    setReply({ edit: false, index: undefined });
  };
  const route = useRouter();

  return (
    <div className="flex  h-full ">
      {error ? (
        <FailSession />
      ) : (
        <>
          {" "}
          {currentTask !== null ? (
            <div className="flex  w-full p-5 lg:p-40 flex-col lg:flex-row ">
              <div className="w-full lg:w-2/3 flex items-center lg:items-start justify-center flex-col  ">
                <div className="flex flex-col w-11/12 rounded-md space-y-3  ">
                  <Button variant={'outline'} onClick={()=>{
                    route.push("/dashboard")
                  }} className="my-5 w-fit"><ExitIcon /></Button>
                  <div className="w-full ">
                    <div className="flex  items-center justify-start space-x-2">
                      <div className="w-full ">
                        <p className=" text-2xl font-bold">
                          {currentTask.title}{" "}
                        </p>
                      </div>
                      {currentTask.createdBy._id === userData?._id ? (
                        <Menubar className="w-fit rounded-lg">
                          <MenubarMenu>
                            <MenubarTrigger>
                              <DotsHorizontalIcon />
                            </MenubarTrigger>
                            <MenubarContent>
                              <MenubarItem asChild>
                                <>
                                  <EditTaskC
                                    task={currentTask}
                                    taskId={params.taskid}
                                  />
                                </>
                              </MenubarItem>
                              <MenubarItem>Delete task</MenubarItem>
                              <MenubarSeparator />
                            </MenubarContent>
                          </MenubarMenu>
                        </Menubar>
                      ) : (
                        ""
                      )}
                    </div>
                    <p className=" text-xs text-muted-foreground font-light ">
                      #{currentTask.id}
                    </p>
                  </div>
                  <div className=" flex-col md:flex-row flex items-start md:items-center space-y-2 justify-start space-x-2 grayscale  ">
                   <div className="flex items-center justify-center w-fit  space-x-2">
                   <Badge variant="outline">
                      <Route className="mr-2 text-xs w-4 h-3" />{" "}
                      {currentTask.status}
                    </Badge>
                    <Badge>{currentTask.priority}</Badge>
                   </div>

                    <p className="text-xs md:text-sm">
                      <span
                        className="font-semibold cursor-pointer  "
                        onClick={() => {
                          route.push("/user/" + currentTask.createdBy._id);
                        }}
                      >
                        {currentTask.createdBy.name}
                      </span>{" "}
                      openned this issue at{" "}
                      {new Date(currentTask.createdBy.time).toLocaleString(
                        "en-US"
                      )}
                      · {currentTask.comments.length} comments
                    </p>
                  
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className=" flex items-center justify-between   h-8">
                      <div className="flex items-center justify-start rounded-lg space-x-2   h-3">
                        <p
                          className="text-xs  hover:font-extrabold transition-all cursor-pointer  font-semibold  text-blue-500"
                          onClick={() => {
                            route.push("/user/" + currentTask.createdBy._id);
                          }}
                        >
                          {currentTask.createdBy.name}
                        </p>
                         
                        <p className="text-xs  text-muted-foreground font-semibold">
                          {new Date(currentTask.createdBy.time).toLocaleString(
                            "en-US"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 font-semibold text-muted-foreground  border-l-slate-600">
                      <p className=" text-xs">{currentTask.description}</p>
                    </div>
                  </div>
                  <Separator className="my-3" />

                  {currentTask.comments.map((comment, index) => {
                    return (
                      <div className="flex items-center rounded-lg border h-full p-5 justify-between relative">
                        <div className="w-full">
                        <div className="mb-2 w-fit">
                          <Menubar className="rounded-lg flex h-5">
                            {comment.owner === userData?.name ? (
                              ""
                            ) : (
                              <MenubarMenu>
                                <MenubarTrigger className=" h-4   ">
                                  <Reply className="h-4" />
                                </MenubarTrigger>
                                <MenubarContent>
                                  <MenubarItem
                                    onClick={() => {
                                      setReply({ edit: true, index: index });
                                    }}
                                  >
                                    Reply this comment{" "}
                                    <MenubarShortcut>⌘T</MenubarShortcut>
                                  </MenubarItem>
                                </MenubarContent>
                              </MenubarMenu>
                            )}

                            {comment.owner === userData?.name ? (
                              <MenubarMenu>
                                <MenubarTrigger className=" h-4  text-xs ">
                                  <DotsHorizontalIcon />
                                </MenubarTrigger>
                                <MenubarContent>
                                  <MenubarItem
                                    onClick={() => {
                                      setEditing({ edit: true, index: index });
                                    }}
                                  >
                                    Edit comment{" "}
                                    <MenubarShortcut>⌘Z</MenubarShortcut>
                                  </MenubarItem>
                                  <MenubarItem
                                    onClick={() => {
                                      deleteComment(comment.id);
                                    }}
                                    className="bg-red-500 text-white"
                                  >
                                    Delete comment{" "}
                                    <MenubarShortcut className="text-white">
                                      ⇧⌘Z
                                    </MenubarShortcut>
                                  </MenubarItem>
                                </MenubarContent>
                              </MenubarMenu>
                            ) : (
                              ""
                            )}
                          </Menubar>
                        </div>
                          <div className="text-xs flex items-start ">
                         
                            <div className="flex items-center justify-start rounded-lg space-x-1   h-3">
                              <p
                                className="text-xs  hover:font-extrabold transition-all cursor-pointer   font-semibold  text-blue-500   "
                                onClick={() => {
                                  route.push("/user/" + comment._id);
                                }}
                              >
                                {comment.owner}
                              </p>
                              
                              <p className="text-xs   text-muted-foreground font-semibold">
                                {new Date(comment.date).toLocaleString("en-US")}
                              </p>
                            </div>
                            
                          </div>

                          {isEditing.index === index ? (
                            <div className="mt-6 mb-2">
                              <Form {...form2}>
                                <form
                                  onSubmit={form2.handleSubmit(
                                    onSubmitNewComment
                                  )}
                                  className=""
                                >
                                  <FormField
                                    control={form2.control}
                                    name="comment"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Textarea
                                            placeholder="Add your comment here..."
                                            {...field}
                                            defaultValue={comment.text}
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="space-x-3 mt-2">
                                    <Button type="submit" onSubmit={() => {}}>
                                      Submit
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={"destructive"}
                                      onClick={() => {
                                        setEditing({
                                          edit: false,
                                          index: undefined,
                                        });
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </form>
                              </Form>
                            </div>
                          ) : (
                            <div className="mt-5 font-semibold text-muted-foreground  border-l-slate-600">
                              {comment.reply_to && (
                                <div className="w-full border-l  flex flex-col justify-start items-start px-2 my-4 grayscale opacity-50">
                                  <p className="text-xs   font-semibold  text-blue-500 ">
                                    {comment.reply_to?.owner}
                                  </p>
                                  <div className="mt-5 font-semibold text-muted-foreground  border-l-slate-600">
                                    <p className=" text-xs">
                                      {comment.reply_to?.text}
                                    </p>
                                  </div>
                                </div>
                              )}
                              <p className=" text-xs ">{comment.text}</p>
                              
                            </div>
                          )}
                          {isReply.index === index ? (
                            <div className="mt-6 mb-2 w-full">
                              <Form {...form2}>
                                <form
                                  onSubmit={form2.handleSubmit(
                                    onSubmitNewComment
                                  )}
                                  className=""
                                >
                                  <FormField
                                    control={form2.control}
                                    name="comment"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Textarea
                                            placeholder="Add your reply here..."
                                            {...field}
                                            className="w-full mb-4"
                                          />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="space-x-3 mt-2">
                                    <Button type="submit" onSubmit={() => {}}>
                                      Submit
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={"destructive"}
                                      onClick={() => {
                                        setReply({
                                          edit: false,
                                          index: undefined,
                                        });
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </form>
                              </Form>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                       
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-center">
                    {currentTask.status === "Closed" ? (
                      <div className="p-4">
                        <h2 className="text-sm font-semibold">
                          This task was closed on
                          <span className="mx-2">
                            {currentTask.feed
                              .slice()
                              .reverse()
                              .find((item) => item.action === "Closed the task")
                              ?.time &&
                              new Date(
                                currentTask.feed
                                  .slice()
                                  .reverse()
                                  .find(
                                    (item) => item.action === "Closed the task"
                                  )?.time
                              ).toLocaleString("en-US")}
                          </span>
                        </h2>
                      </div>
                    ) : (
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="w-full space-y-6"
                        >
                          <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Add a comment</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Add your comment here..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                 
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" onSubmit={() => {}}>
                            Submit
                          </Button>
                        </form>
                      </Form>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/4 h-full my-5 ">
                <h2 className="text-lg font-semibold">Task feed</h2>
                <p className="text-muted-foreground  text-sm">
                  Visualize a stream of real-time notifications with your team.
                </p>
                {currentTask.feed.map((item) => {
                  return (
                    <div className={"border p-4  rounded-lg  my-3"}>
                      <div className="flex items-center space-x-1">
                        <p className="text-xs">{item.name}</p>
                        <p className="text-xs">
                          {new Date(item.time).toLocaleString("en-US")}
                        </p>
                      </div>
                      <p className="font-bold text-xs">{item.action}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-full h-screen flex items-center justify-center flex-col absolute ">
            
              <div className="bottom-0 absolute left-0 m-6">
                <LoadingToast />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default page;

const editTask = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  priority: z.enum(["High", "Medium", "Low", "Urgent", "Important", "Normal"]),
  status: z.enum(["Completed", "To-do", "On-going", "Closed"]),
});

const EditTaskC = (props: { task: task; taskId: string }) => {
  const [load, setLoad] = useState(false);

  const taskPriorities = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
    { value: "Urgent", label: "Urgent" },
    { value: "Important", label: "Important" },
    { value: "Normal", label: "Normal" },
  ];

  const taskStatus = [
    { value: "Completed", label: "Completed" },
    { value: "To-do", label: "To-do" },
    { value: "On-going", label: "On-going" },
    { value: "Closed", label: "Closed" },
  ];
  const user = userStore();

  const form = useForm<z.infer<typeof editTask>>({
    resolver: zodResolver(editTask),
    defaultValues: {
      title: props.task.title,
      description: props.task.description,
      priority: props.task.priority,
      status: props.task.status,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof editTask>) {
    const newTask = {
      ...props.task,
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
    };
    handleEditTask(newTask);
  }

  async function handleEditTask(newTask: task) {
    if (newTask.status === "Closed") {
      await fetch(`http://localhost:3030/tasks/edit`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: newTask,
          owner: user.user?.name,
          taskId: props.taskId,
          action: "Closed the task",
        }),
      });
    } else {
      await fetch(`http://localhost:3030/tasks/edit`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: newTask,
          owner: user.user?.name,
          taskId: props.taskId,
          action: "Edited task",
        }),
      });
    }
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className=" w-full  flex items-start justify-start p-2 font-normal"
          >
            Edit task
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit your task</AlertDialogTitle>
            <AlertDialogDescription>
              Manage your current task effortlessly by utilizing the form
              bellow.{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="w-[240px] md:w-[600px] flex items-start justify-normal">
            <div className="w-full transition-all">
              <div className="w-full p-2   space-y-3"></div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className=" w-full flex items-center justify-center flex-col "
                >
                  <div className="w-full p-2 flex items-center justify-normal space-x-3 md:flex-row flex-col">
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
                        <FormItem className="md:w-96 w-full">
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
                                  <SelectItem value={p.value}>
                                    {p.label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="md:w-96 w-full">
                          <FormLabel>Status</FormLabel>

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {taskStatus.map((p) => {
                                return (
                                  <SelectItem value={p.value}>
                                    {p.label}
                                  </SelectItem>
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
                    <AlertDialogTrigger>
                      <Button
                        disabled={load ? true : false}
                        type="submit"
                        className="w-fit"
                      >
                        {load ? (
                          <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Please wait{" "}
                          </>
                        ) : (
                          "Continue"
                        )}
                      </Button>
                    </AlertDialogTrigger>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

/*   <div
                        className={
                          isEditing.index === index
                            ? "  rounded-md space-y-1  shadow-md relative transition-all"
                            : "  rounded-md space-y-1  relative"
                        }
                      >
                        <div
                          className={
                            isEditing.index === index
                              ? "space-x-1 flex items-center justify-between  bg-slate-50  h-8 transition-all"
                              : "space-x-1 flex items-center justify-between    h-8"
                          }
                        >
                          <div className="flex items-center justify-start   h-3">
                            <p className="text-xs  font-semibold mr-1 text-blue-500">
                              {comment.owner} ·{" "}
                            </p>
                            {comment.owner === currentTask.createdBy.name ? (
                              <p className="text-xs font-light text-slate-700">
                                Author
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div>
                            <Menubar className="rounded-lg flex h-8" > 
                            {currentTask.createdBy.id === user.user?.id ? "" :   <MenubarMenu>
                                <MenubarTrigger className=" h-6 w-10  ">
                                  <Reply className="h-6" />
                                </MenubarTrigger>
                                <MenubarContent>
                                  <MenubarItem>
                                    Reply this comment{" "}
                                    <MenubarShortcut>⌘T</MenubarShortcut>
                                  </MenubarItem>
                                </MenubarContent>
                              </MenubarMenu>}
                            
                              {currentTask.createdBy.id === user.user?.id ? (
                                <MenubarMenu>
                                  <MenubarTrigger className=" h-6 w-10 text-xs ">
                                    <DotsHorizontalIcon />
                                  </MenubarTrigger>
                                  <MenubarContent>
                                    <MenubarItem>
                                      Edit comment{" "}
                                      <MenubarShortcut>⌘Z</MenubarShortcut>
                                    </MenubarItem>
                                    <MenubarItem className="bg-red-500 text-white">
                                      Delete comment{" "}
                                      <MenubarShortcut className="text-white">
                                        ⇧⌘Z
                                      </MenubarShortcut>
                                    </MenubarItem>
                                  </MenubarContent>
                                </MenubarMenu>
                              ) : (
                                ""
                              )}
                            </Menubar>
                          </div>
                        </div>
                        <div
                          className={
                            isEditing.index === index ? " text-sm " : " text-sm"
                          }
                        >
                          {isEditing.index === index ? (
                            <Form {...form2}>
                              <form
                                onSubmit={form2.handleSubmit(
                                  onSubmitNewComment
                                )}
                                className="w-full space-y-6"
                              >
                                <FormField
                                  control={form2.control}
                                  name="comment"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Edit your comment</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Add your comment here..."
                                          {...field}
                                          defaultValue={comment.text}
                                        />
                                      </FormControl>

                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="space-x-3">
                                  <Button type="submit" onSubmit={() => {}}>
                                    Submit
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={"destructive"}
                                    onClick={() => {
                                      setEditing({
                                        edit: false,
                                        index: undefined,
                                      });
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          ) : (
                            <div className="font-medium text-sm space-y-6  mb-7 ">
                              <p>{comment.text}</p>
                            </div>
                          )}
                        </div>

                        <Separator className="my-3" />
                      </div> */

/*<DropdownMenu>

                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        size={"icon"}
                                        className="h-5"
                                        variant={"ghost"}
                                      >
                                        <MenuIcon className="h-3 w-3 text-sm" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem>
                                        {comment.owner ===
                                        currentTask.createdBy.name ? (
                                          <Button
                                            className="w-full"
                                            variant={"link"}
                                            onClick={() => {
                                              setEditing({
                                                edit: true,
                                                index: index,
                                              });
                                            }}
                                          >
                                            Editar
                                          </Button>
                                        ) : (
                                          <p>Denunciar comentário</p>
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        {comment.owner ===
                                        currentTask.createdBy.name ? (
                                          <Button
                                            variant={"destructive"}
                                            className="w-full"
                                            onClick={() => {
                                              deleteComment(comment.id);
                                            }}
                                          >
                                            Deletar
                                          </Button>
                                        ) : (
                                          ""
                                        )}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu> */
