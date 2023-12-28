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
    getTask();
    const socket = io("http://localhost:3030");

    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("new-comment", () => {
      getTask();
    });
    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const [userData, load] = useGetCurrentUser();
  const user = userStore();

  async function getTask() {
    const resp = await fetch(`http://localhost:3030/tasks/${params.taskid}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await resp.json();

    if (data.data !== "error") {
      setCurrentTask(data.data);
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
      `http://localhost:3030/tasks/addcomment/${params.taskid}`,
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
        `http://localhost:3030/tasks/${params.taskid}/comment`,
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
      `http://localhost:3030/tasks/${params.taskid}/comment`,
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

  return (
    <div className="flex  h-full ">
      {error ? (
        <FailSession />
      ) : (
        <>
          {" "}
          {currentTask !== null ? (
            <div className="flex  w-full p-40 ">
              <div className="w-2/3 flex items-start justify-center ">
                <div className="flex flex-col w-9/12 rounded-md space-y-3  ">
                  <div className=" ">
                    <div className="flex items-center justify-start space-x-2">
                      <div className="w-full">
                        <p className=" text-2xl font-bold">
                          {currentTask.title}{" "}
                        </p>
                      </div>
                      {currentTask.createdBy.id === userData?._id ? (
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
                  <div className="  flex items-center justify-start space-x-2 grayscale  ">
                    <Badge variant="outline">
                      <Route className="mr-2 text-xs w-4 h-3" />{" "}
                      {currentTask.status}
                    </Badge>
                    <Badge>{currentTask.priority}</Badge>

                    <p className="text-sm">
                      <span className="font-semibold cursor-pointer ">
                        {currentTask.createdBy.name}
                      </span>{" "}
                      openned this issue at{" "}
                      {new Date(currentTask.createdBy.time).toLocaleString(
                        "en-US"
                      )}
                    </p>
                    <p className="text-sm">
                      · {currentTask.comments.length} comments
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className=" flex items-center justify-between     h-8">
                      <div className="flex items-center justify-start rounded-lg   h-3">
                        <p className="text-xs   font-semibold  text-blue-500">
                          {currentTask.createdBy.name}
                        </p>
                        <Badge
                          className="rounded-md mx-2 h-5"
                          variant={"outline"}
                        >
                          <p className="text-xs">Author</p>
                        </Badge>
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
                      <div className="flex items-center rounded-lg border h-full p-5 justify-between">
                        <div className="w-full">
                    
                          <div className="text-xs flex items-start ">
                          

                            <div className="flex items-center justify-start rounded-lg   h-3">
                              <p className="text-xs   font-semibold  text-blue-500">
                                {comment.owner}
                              </p>
                              {comment.owner === currentTask.createdBy.name ? (
                                <Badge
                                  className="rounded-md mx-2 h-5"
                                  variant={"outline"}
                                >
                                  <p className="text-xs">Author</p>
                                </Badge>
                              ) : (
                                ""
                              )}
                              <p className="text-xs ml-1  text-muted-foreground font-semibold">
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
                                  {comment.reply_to &&  <div className="w-full border-l  flex flex-col justify-start items-start px-2 my-4 grayscale opacity-50">
                              <p className="text-xs   font-semibold  text-blue-500 ">
                                {comment.reply_to?.owner}
                              </p>
                              <div className="mt-5 font-semibold text-muted-foreground  border-l-slate-600">
                              <p className=" text-xs">{comment.reply_to?.text}</p>
                            </div>
                            </div>}
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
                        <div className=" flex items-start justify-start px-2 py-3">
                          <Menubar className="rounded-lg flex h-5">
                            {comment.owner === userData?.name ? (
                              ""
                            ) : (
                              <MenubarMenu>
                                <MenubarTrigger className=" h-4 w-10  ">
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
                                <MenubarTrigger className=" h-4 w-10 text-xs ">
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
                                  You can <span>@mention</span> other users
                                  related to the current task.
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

              <div className="w-1/4 h-full ">
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
              <svg
                width="342"
                height="90"
                viewBox="0 0 342 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M149.49 74H115.65V13.7H147.69C152.31 13.7 156.12 14.24 159.12 15.32C162.18 16.34 164.46 17.96 165.96 20.18C167.46 22.34 168.21 25.13 168.21 28.55C168.21 32.33 167.19 35.33 165.15 37.55C163.11 39.77 160.02 41.06 155.88 41.42V42.59C160.98 42.77 164.76 44.24 167.22 47C169.74 49.76 171 53.18 171 57.26C171 60.74 170.22 63.74 168.66 66.26C167.16 68.78 164.82 70.7 161.64 72.02C158.46 73.34 154.41 74 149.49 74ZM132.57 49.79V58.79H148.86C150.48 58.79 151.71 58.55 152.55 58.07C153.39 57.59 153.81 56.36 153.81 54.38C153.81 52.34 153.42 51.08 152.64 50.6C151.86 50.06 150.6 49.79 148.86 49.79H132.57ZM132.57 28.91V36.65H146.79C148.53 36.65 149.7 36.38 150.3 35.84C150.96 35.3 151.29 34.28 151.29 32.78C151.29 31.16 150.9 30.11 150.12 29.63C149.4 29.15 148.17 28.91 146.43 28.91H132.57ZM218.624 74H202.784V66.98L202.514 64.1V45.11C202.514 43.67 202.124 42.68 201.344 42.14C200.624 41.54 199.034 41.24 196.574 41.24C194.114 41.24 192.464 41.51 191.624 42.05C190.844 42.59 190.454 43.55 190.454 44.93V46.37H174.344V45.29C174.344 41.45 175.274 38.18 177.134 35.48C179.054 32.72 181.724 30.59 185.144 29.09C188.564 27.59 192.584 26.84 197.204 26.84C202.004 26.84 205.964 27.56 209.084 29C212.264 30.44 214.634 32.6 216.194 35.48C217.814 38.3 218.624 41.9 218.624 46.28V74ZM187.304 74.9C183.344 74.9 180.014 73.85 177.314 71.75C174.614 69.59 173.264 66.41 173.264 62.21C173.264 59.81 173.774 57.74 174.794 56C175.874 54.2 177.464 52.73 179.564 51.59C181.724 50.45 184.454 49.61 187.754 49.07L203.414 46.55V56.45L191.264 58.52C190.364 58.64 189.704 58.88 189.284 59.24C188.924 59.54 188.744 60.02 188.744 60.68C188.744 61.46 189.044 62 189.644 62.3C190.244 62.54 191.324 62.66 192.884 62.66C195.224 62.66 197.084 62.45 198.464 62.03C199.904 61.55 200.924 60.83 201.524 59.87C202.184 58.85 202.514 57.53 202.514 55.91L203.774 68.42H201.974C201.314 69.38 200.384 70.37 199.184 71.39C197.984 72.35 196.424 73.19 194.504 73.91C192.584 74.57 190.184 74.9 187.304 74.9ZM244.631 74.9C237.011 74.9 231.401 73.46 227.801 70.58C224.201 67.7 222.401 63.62 222.401 58.34V58.07H238.151V59.24C238.151 60.08 238.301 60.74 238.601 61.22C238.901 61.64 239.501 61.94 240.401 62.12C241.361 62.3 242.771 62.39 244.631 62.39C246.191 62.39 247.331 62.33 248.051 62.21C248.771 62.09 249.221 61.88 249.401 61.58C249.641 61.22 249.761 60.77 249.761 60.23C249.761 59.51 249.521 59 249.041 58.7C248.561 58.34 247.361 57.98 245.441 57.62L236.621 56C233.561 55.4 230.951 54.56 228.791 53.48C226.631 52.4 224.981 50.93 223.841 49.07C222.761 47.15 222.221 44.69 222.221 41.69C222.221 37.43 223.931 33.89 227.351 31.07C230.831 28.25 235.991 26.84 242.831 26.84C246.791 26.84 250.331 27.41 253.451 28.55C256.631 29.69 259.121 31.4 260.921 33.68C262.781 35.96 263.711 38.81 263.711 42.23V43.94H247.871V43.13C247.871 42.17 247.721 41.45 247.421 40.97C247.121 40.43 246.551 40.07 245.711 39.89C244.931 39.65 243.821 39.53 242.381 39.53C240.341 39.53 239.051 39.74 238.511 40.16C238.031 40.52 237.791 41.03 237.791 41.69C237.791 42.29 237.971 42.77 238.331 43.13C238.751 43.49 239.711 43.82 241.211 44.12L251.561 46.28C255.041 47 257.771 47.96 259.751 49.16C261.791 50.3 263.231 51.77 264.071 53.57C264.971 55.31 265.421 57.44 265.421 59.96C265.421 64.34 263.651 67.94 260.111 70.76C256.571 73.52 251.411 74.9 244.631 74.9ZM291.599 74.9C286.619 74.9 282.359 73.97 278.819 72.11C275.339 70.19 272.669 67.49 270.809 64.01C269.009 60.47 268.109 56.24 268.109 51.32C268.109 46.22 269.039 41.84 270.899 38.18C272.759 34.52 275.489 31.73 279.089 29.81C282.689 27.83 287.039 26.84 292.139 26.84C297.119 26.84 301.259 27.74 304.559 29.54C307.919 31.34 310.409 33.83 312.029 37.01C313.709 40.13 314.549 43.76 314.549 47.9C314.549 49.16 314.459 50.42 314.279 51.68C314.099 52.94 313.949 53.96 313.829 54.74H275.309V45.56H299.159L298.439 46.01C298.499 44.93 298.319 43.97 297.899 43.13C297.539 42.23 296.819 41.51 295.739 40.97C294.719 40.43 293.219 40.16 291.239 40.16C288.479 40.16 286.559 40.67 285.479 41.69C284.399 42.65 283.859 44.21 283.859 46.37V52.76C283.859 54.98 284.039 56.69 284.399 57.89C284.759 59.03 285.509 59.81 286.649 60.23C287.789 60.65 289.529 60.86 291.869 60.86C293.909 60.86 295.319 60.65 296.099 60.23C296.879 59.75 297.269 59 297.269 57.98V57.8H314.009V58.88C314.009 62 313.079 64.76 311.219 67.16C309.419 69.56 306.839 71.45 303.479 72.83C300.179 74.21 296.219 74.9 291.599 74.9ZM335.321 74H318.491V13.7H335.321V74Z"
                  fill="black"
                />
                <rect width="90" height="90" rx="7.5" fill="#FEE903" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M75.2277 33.9777C76.6922 35.4422 76.6922 37.8165 75.2277 39.281L45.7769 68.7318C44.3124 70.1963 41.938 70.1963 40.4736 68.7318L18.5227 46.781C17.0583 45.3165 17.0583 42.9422 18.5227 41.4777L26.4777 33.5227C27.9422 32.0583 30.3165 32.0583 31.781 33.5227L43.1252 44.867L61.9694 26.0227C63.4339 24.5583 65.8083 24.5583 67.2727 26.0227L75.2277 33.9777Z"
                  fill="black"
                />
              </svg>
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
          <div className="w-[600px] flex items-start justify-normal">
            <div className="w-full transition-all">
              <div className="w-full p-2  space-y-3"></div>
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
                        <FormItem className="w-96">
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
