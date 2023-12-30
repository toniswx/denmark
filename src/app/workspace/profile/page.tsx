"use client";
import React from "react";
import useGetCurrentUser from "../../../../hooks/useGetCurrentUse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const userSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
});

function page() {
  const [userData, load] = useGetCurrentUser();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: userData?.name,
      email: userData?.email,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof userSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    const name = values.name === undefined ? userData!.name : values.name;
    const bio = values.bio === undefined ? userData!.bio : values.bio;

    if (name === undefined) return;
    if (bio === undefined) return;

    const resp = await fetch("https://basel-ru5b.vercel.app/user/profile/edit", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bio: bio, id: userData!._id }),
    });

    const data = await resp.json();

    if (data.status === "ok") {
      console.log(data);
      location.reload();
    }
  }
  const route = useRouter()
  return (
    <div className="flex items-center justify-center w-full h-screen md:space-x-36 p-10 flex-col">
      
      
      <div className="md:w-1/2 w-full border rounded-md p-10">
      <Button className="my-2 " onClick={()=>{
        route.push("/dashboard")
      }}><ArrowLeft /></Button>
        <div className="my-3">
          <h2 className="font-bold text-2xl">Profile</h2>
          <p className="text-muted-foreground text-sm">
            Manage your profile configuration
          </p>
        </div>
        {load === "success" ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        defaultValue={userData?.name}
                        disabled
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        defaultValue={userData?.email}
                        disabled
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} defaultValue={userData?.bio} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default page;
