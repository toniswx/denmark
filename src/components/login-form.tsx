"use client";
import Link from "next/link";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LockClosedIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ApiResponse } from "../../types";
import { useRouter } from "next/navigation";

function LoginForm() {

  
  const route = useRouter()

  const loginSchema = z.object({
    email: z.string().email({
      message: "Invalid email",
    }),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

 async function onSubmit(values: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
      const data = await fetch("http://localhost:3030/user/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

   if(data.ok){
      route.push("/dashboard")
   }
  
  

  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
      <div className="flex items-center justify-center my-5  ">
        <Link href={"/singin"} className="w-full">
          {" "}
          <Button className="w-full  " variant={"outline"}>
            {" "}
            <OpenInNewWindowIcon className="mr-2" /> Create new account
          </Button>{" "}
        </Link>

        <Link href={""} className="w-full">
          <Button className="w-full ml-1  " variant={"outline"}>
            <LockClosedIcon className="mr-2" /> Recovery account
          </Button>
        </Link>
      </div>
      <Separator className="" />

      <div className="flex items-start justify-center my-3 flex-col  ">
        {" "}
        <Button
          className="flex flex-col w-full gap-1 m-2 "
          variant={"secondary"}
          disabled
        >
          <div className=" rounded-md flex items-center justify-center ">
            <svg
              width="29"
              height="19"
              viewBox="0 0 29 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_204_105)">
                <path
                  d="M28.5 14.5C28.5 6.76801 22.232 0.5 14.5 0.5C6.76801 0.5 0.5 6.76801 0.5 14.5C0.5 21.4877 5.61957 27.2796 12.3125 28.3299V18.5469H8.75781V14.5H12.3125V11.4156C12.3125 7.90687 14.4027 5.96875 17.6005 5.96875C19.1318 5.96875 20.7344 6.24219 20.7344 6.24219V9.6875H18.9691C17.23 9.6875 16.6875 10.7668 16.6875 11.875V14.5H20.5703L19.9496 18.5469H16.6875V28.3299C23.3804 27.2796 28.5 21.4877 28.5 14.5Z"
                  fill="#1877F2"
                />
                <path
                  d="M19.9496 18.5469L20.5703 14.5H16.6875V11.875C16.6875 10.7679 17.23 9.6875 18.9691 9.6875H20.7344V6.24219C20.7344 6.24219 19.1323 5.96875 17.6005 5.96875C14.4027 5.96875 12.3125 7.90688 12.3125 11.4156V14.5H8.75781V18.5469H12.3125V28.3299C13.762 28.5567 15.238 28.5567 16.6875 28.3299V18.5469H19.9496Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_204_105">
                  <rect
                    width="28"
                    height="28"
                    fill="white"
                    transform="translate(0.5 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            <p className="mx-2 text-xs">
              {" "}
              Login through others platforms comming soon
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
}

export default LoginForm;
