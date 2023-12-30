"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  PlusIcon,
  FileIcon,
  PlusCircledIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import userStore from "../../store/user";
import {
  Card,
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

const inviteSchema = z.object({
  id: z.string().uuid({ message: "Invalid id" }),
});

function newteam() {
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
      name: user?.name,
      id: user!._id,
    };
    const teamData = {
      teamId: card?.teamId,
      teamName: card?.teamName,
    };
    console.log(userData);
    const resp = await fetch("https://basel-ru5b.vercel.app/team/add/user", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: userData, team: teamData }),
    });

    const data = await resp.json();

    if (data.status === "ok") {
      sessionStorage.clear();
      location.reload();
    }
  };

  return (
    <div className="flex justify-around flex-col  items-center w-full   ">
      <div className="w-full">
        <AlertDialog>
          <AlertDialogTrigger asChild className=" w-full">
            <Button variant="outline" className="w-full flex items-center justify-start text-start">
              Add new team
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="transition-all w-9/12">
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
                      <CardDescription>
                        Team ID:{card.invite_link}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter>
                      <Button
                        onClick={() => {
                          handleAddUserToTeam();
                        }}
                      >
                        Enter team
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  ""
                )}
                <AlertDialogFooter className="justify-start sm:justify-start ">
                  <Button type="submit" className="my-2">Find team</Button>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default newteam;
