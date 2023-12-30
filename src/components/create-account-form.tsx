"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LockClosedIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ScanEye, EyeIcon, EyeOff } from "lucide-react";
import { ApiResponse } from "../../types";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "./ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import  {ProgressDemo}  from "@/components/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useCreateNewAccount from "../../hooks/useCreateAccount";
import userStore from "../../store/user";
function createAccountForm() {

  
  const router = useRouter()
  const resetUser = userStore((state) => state.resetUser)

  const [loadinSpin,setLoadSpin] = useState<boolean>(false)
  const appFeatures = [
    {
      section: "What we offer",
      content: [
        "A go-to task manager for teams, designed to boost productivity and streamline collaboration.",
      ],
    },
    {
      section: "Free",
      content: [
        "Free: Enjoy the benefits of Basel without any cost. Our app is always free to use for your team.",
      ],
    },
    {
      section: "Easy-to-Use",
      content: [
        "Easy-to-Use: Basel is designed with simplicity in mind, ensuring a seamless and intuitive experience for all team members.",
        "Empowers teams: Our user-friendly interface empowers teams to manage tasks effortlessly, making collaboration a breeze.",
      ],
    },
    {
      section: "Team Collaboration",
      content: [
        "Efficient Collaboration: Foster teamwork and enhance communication with features that facilitate smooth collaboration on tasks and projects.",
        "Real-time Updates: Stay in the loop with real-time updates on task progress, ensuring everyone is on the same page.",
      ],
    },
    {
      section: "Productivity Boost",
      content: [
        "Boost Productivity: Basel is crafted to enhance productivity by helping teams organize tasks, set priorities, and meet deadlines.",
        "Customizable Workflows: Tailor Basel to fit your team's unique workflow, maximizing efficiency.",
      ],
    },
    {
      section: "Task Management",
      content: [
        "Comprehensive Task Management: From creation to completion, manage tasks with ease using Basel's robust task management features.",
      ],
    },

    {
      section: "Feedback",
      content: [
        "Your Feedback Matters: We value your input. Share your feedback to help us continuously improve Basel for your team.",
      ],
    },
    {
      section: "Get Started",
      content: [
        "Ready to boost your team's productivity? Get started with Basel today!",
      ],
    },
  ];
  const termsOfService = [
    {
      section: "Welcome",
      content:
        "These terms of service ('Terms') govern your use of Basel ('the App'). By using the App, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please do not use the App.",
    },
    {
      section: "User Content",
      content: [
        "You are responsible for any content you create, upload, or share using the App.",
        " Basel does not claim ownership of your content, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute it.",
      ],
    },
    {
      section: "Account Information",
      content: [
        "You are responsible for maintaining the confidentiality of your account and password.",
        "Notify us immediately if you become aware of any unauthorized use of your account.",
      ],
    },
    {
      section: "Privacy",
      content: [
        "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and disclose information.",
      ],
    },
    {
      section: "Prohibited Conduct",
      content: [
        "Do not engage in any activity that may interfere with or disrupt the App.",
        "Respect the rights of others and refrain from any abusive, threatening, or harmful behavior.",
      ],
    },
    {
      section: "Termination",
      content: [
        "We reserve the right to terminate or suspend your account without notice if you violate these Terms.",
      ],
    },
    {
      section: "Changes to Terms",
      content: [
        "We may update these Terms from time to time. Continued use of the App after the changes become effective constitutes your acceptance of the revised Terms.",
      ],
    },
    {
      section: "Disclaimer",
      content: [
        "The App is provided on an 'as-is' and 'as-available' basis. We make no warranties, expressed or implied, regarding the App's reliability, accuracy, or availability.",
      ],
    },
    {
      section: "Limitation of Liability",
      content: [
        "Basel and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.",
      ],
    },
    {
      section: "Contact Us",
      content: [
        "If you have any questions or concerns about these Terms, please contact us at [your contact email].",
      ],
    },
    {
      section: "Agreement",
      content: [
        "By using Basel, you agree to these Terms. Thank you for being a part of our community!",
      ],
    },
  ];

 
  useEffect(()=>{
    sessionStorage.clear()
    resetUser()

  },[])

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<{ message: null | string }>({
    message: null,
  });

  const newAccountFormSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(3, { message: "Name is required. Please provide your name." }),
    passowrd: z
      .string({
        required_error: "Password is required",
      })
      .min(7, { message: "Must be 5 or more characters long" }),
    terms: z.boolean(),
  });

  const form = useForm<z.infer<typeof newAccountFormSchema>>({
    resolver: zodResolver(newAccountFormSchema),
  });

  async function onSubmit(values: z.infer<typeof newAccountFormSchema>) {
     
    sessionStorage.clear()
    setLoadSpin(true)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  


    try {
      const response = await fetch("https://basel-ru5b.vercel.app/user/create/new", {
        method: "POST",
        credentials: "include",
        headers:{
          'Content-Type':'application/json',
          'Origin': 'http://localhost:3000'
        },
        body:JSON.stringify({name:values.name,email:values.email,password:values.passowrd})
      });
  
       const data:ApiResponse = await response.json()

       

       if(data.message === "Email already in use"){
         console.log("email in use")
          setTimeout(() => {
          setLoadSpin(false)
          setError({message:data.message}) 
        }, 1200)
      
      }else if(data.status === 'success'){
        router.push("/dashboard")
      }

       
    } catch (error) {}
    
  }


  

  return (


    <>
    {loadinSpin ? <div className=" flex items-center justify-center cursor-progress  z-10 h-screen absolute top-0 w-full bg-slate-900 opacity-70"> 
    <ProgressDemo />
     </div> : "" }
    <div className="w-full  h-screen  flex items-center justify-center space-x-10 flex-row-reverse ">
      <div className=" w-full space-y-8 p-10 md:p-0 md:w-1/3">
        <div>
          <h2 className="text-lg font-bold">Welcome !</h2>
          <p className="text-muted-foreground text-xs">
            Create your account to start manage your tasks.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field}  />
                  </FormControl>
                   <FormDescription>
                    {error.message !== null  ? <p className="text-red-500">{error.message}</p> : ""}
                   </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Liana Jhonson" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passowrd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-end">
                      <Input
                        placeholder=""
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <span
                        onClick={() => {
                          setShowPassword((oldValue) => !oldValue);
                        }}
                        className="absolute mr-5 z-10 cursor-pointer  px-3 py-1 "
                      >
                        {showPassword ? <EyeIcon /> : <EyeOff />}{" "}
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Make sure to make a strong password
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Accept terms and conditions</FormLabel>
                    <FormDescription>
                      <Dialog>
                        <DialogTrigger>
                          Click here to check the Terms of Service
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Terms of Service for Basel 2023
                            </DialogTitle>
                            <DialogDescription asChild>
                              <>
                                <ScrollArea className="h-[600px]   p-4">
                                  {termsOfService.map((terms) => {
                                    return (
                                      <div className="my-3">
                                        <h2 className="text-sm font-bold">
                                          {terms.section}
                                        </h2>
                                        <p className="text-xs text-muted-foreground">
                                          {terms.content}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </ScrollArea>
                              </>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
      <div className="w-1/2 hidden md:block  ">
        {appFeatures.map((features) => {
          return (
            <div className="my-5">
              <h2 className=" font-bold  ">{features.section}</h2>
              {features.content.map((x) => {
                return (
                  <p className="text-xs text-muted-foreground my-1">{x}</p>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}

export default createAccountForm;
