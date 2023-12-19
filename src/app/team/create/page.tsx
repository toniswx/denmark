"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import useGetCurrentUser from "../../../../hooks/useGetCurrentUse";
import { sessionApiCall, user } from "../../../../types";
import { Link1Icon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import multiStepFormStore from "../../../../store/formsteps";
import userStore from "../../../../store/user";

const multiStepForm = z.object({
  team_name: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
});

function page() {
  const currentStep = multiStepFormStore((state) => state.currentStep);

  const steps = [
    { title: "Create a unique identity for your team", component: <StepOne /> },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-96 h-80  flex flex-col justify-normal items-center">
        <h2 className="my-5 font-bold text-4xl"> {steps[currentStep].title}</h2>
        {steps[currentStep].component}
        <div className="flex items-center justify-center w-full my-10">
          <p className="text-muted-foreground text-xs">
            {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;

const StepOne = () => {
  const [userData, status] = useGetCurrentUser();

  const projectIndex = userStore((state) => state.currentTeamIndex);

  const router = useRouter();

  const [loadButtonState, setLoadButtonState] = useState<boolean>(false);
  const nextStep = multiStepFormStore((state) => state.nextStep);
  const setCurrentUser = userStore((state) => state.setCurrentUser);

  const form = useForm<z.infer<typeof multiStepForm>>({
    resolver: zodResolver(multiStepForm),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof multiStepForm>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    fetch("http://localhost:3030/team/create/new", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamName: values.team_name, teamId: uuidv4() }),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        return resp.json();
      })
      .then((data) => {
        getData();
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  async function getData() {
    const getUserData = await fetch("http://localhost:3030/user/get/current", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resp: sessionApiCall<user> = await getUserData.json();

    setCurrentUser(resp);
    
    if (userData) {
      setTimeout(() => {
        router.push("/dashboard/");
      }, 1000);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8  w-full"
      >
        <FormField
          control={form.control}
          name="team_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>This is your public team name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex items-center justify-center">
          <Button
            type="submit"
            disabled={loadButtonState === true ? true : false}
            onClick={() => {
              setLoadButtonState(true);
            }}
          >
            {loadButtonState === true ? "Please wait" : "Next"}
            {loadButtonState === true ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              ""
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const StepTwo = () => {
  const formData = multiStepFormStore((state) => state.formData);
  const setCurrentUser = userStore((state) => state.setCurrentUser);

  useEffect(() => {
    async function getData() {
      const getUserData = await fetch(
        "http://localhost:3030/user/get/current",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resp: sessionApiCall<user> = await getUserData.json();

      setCurrentUser(resp);
    }
    getData();
  }, []);

  return (
    <div className="space-y-9 w-full flex items-center justify-center flex-col">
      <div className="mb-5">
        <p className="mb-2 text-muted-foreground">
          Send this link to users who you want to colaborate
        </p>
      </div>
      <Button variant={"link"}>
        Copy invite link
        <Link1Icon className="mx-2" />
      </Button>
      <div className="flex items-center justify-center">
        <Button className="my-4">Next</Button>
      </div>
    </div>
  );
};
