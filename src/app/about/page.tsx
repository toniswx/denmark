"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  OpenInNewWindowIcon,
  RocketIcon,
  CrumpledPaperIcon,
  TimerIcon,
  LockOpen2Icon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import HeroImage from "../../public/edibunrh.jpg";
import Navbar from "@/components/navbar";
import Gradient from "../../public/gradient.png";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  const taskManagerFeatures = [
    {
      title: "Task Creation and Assignment",
      description:
        "Ability to create tasks with titles, descriptions, due dates, and priority levels. Option to assign tasks to specific team members.",
    },
    {
      title: "Task Tracking",
      description:
        "Clear visibility into the status of each task (e.g., to-do, in progress, completed). Progress tracking to monitor task completion.",
    },
    {
      title: "Collaboration and Communication",
      description:
        "Commenting or discussion threads attached to each task for team communication. Notifications for updates, mentions, or changes to tasks.",
    },

    {
      title: "Due Date Reminders",
      description:
        "Automated reminders for upcoming task due dates to avoid missed deadlines.",
    },
    {
      title: "User Permissions",
      description:
        "Role-based access control to define who can view, edit, or delete tasks.",
    },
    {
      title: "Sorting and Filtering",
      description:
        "Sorting tasks based on due dates, priority, or other criteria. Filtering tasks by assignee, status, or tags for quick organization.",
    },
    {
      title: "Search Functionality",
      description:
        "Efficient search capabilities to locate tasks quickly, especially in larger projects.",
    },
    {
      title: "Customization",
      description:
        "Ability to customize task views, fields, and notifications according to team preferences.",
    },
    {
      title: "Reporting and Analytics",
      description:
        "Reporting features to track overall team performance, task completion rates, and project insights.",
    },
  ];
  const cardContent = [
    {
      title: "Organized",
      icon: <CrumpledPaperIcon />,
      description:
        "Seamlessly manage tasks, streamline communication, and boost productivity. Say goodbye to chaos and hello to organized success.",
    },
    {
      title: "Agility",
      icon: <TimerIcon />,
      description:
        "Embrace agility with our cutting-edge app designed for dynamic teams. Navigate projects effortlessly, foster collaboration, and adapt on the fly. Elevate your agile workflow and watch your team sprint towards success.",
    },
    {
      title: "User-friendly ",
      icon: <LockOpen2Icon />,

      description:
        "Effortlessly navigate through customizable dashboards, track progress, and empower your team with tools that just make sense. Your work, simplified and supercharged.",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-center   w-full flex-col bg-gradient-to-b from-transparent via-gray-100">
        <div className="w-1/2  flex items-center justify-center flex-col mt-40 p-2 relative  ">
          <div className="h-1/2 w-full flex items-center justify-center flex-col space-y-10 ">
            <p className="  font-bold text-4xl grayscale-0">
              Our app streamlines tasks, boosts productivity, and simplifies
              teamwork. Stay organized, communicate effortlessly.
            </p>
            <p className="text-muted-foreground text-sm">
              Discover seamless collaboration on our powerful platform, catering
              to both solo and team endeavors. With an intuitive interface and
              robust task management, it transforms work into a streamlined
              experience. Boost productivity, enhance communication, and
              effortlessly meet deadlines. Your journey to efficient and
              organized collaboration begins here.
            </p>

            <div className="flex items-center justify-center  space-x-3">
              <Button className="" onClick={() => {
                router.push("/login");
              }} variant={"outline"}>
                {" "}
                <RocketIcon className="mr-2 h-4 w-4" /> Try for free{" "}
              </Button>
              <Button className="">
                {" "}
                <OpenInNewWindowIcon className="mr-2 h-4 w-4" /> See docs{" "}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full  "></div>

      <div className="flex items-center justify-center w-full  ">
        <div className="grid grid-cols-3 gap-10 w-9/12 p-10">
          {cardContent.map((card) => (
            <div className=" w-full rounded-md shadow-sm flex flex-col px-5 py-10 space-y-7 bg hover:shadow-2xl transition-all cursor-pointer backdrop-filter backdrop-blur-sm">
              <div className="b  flex items-center justify-start  ">
                <div className="shadow p-3 0 text-2xl  bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100  rounded-md text-black">
                  {card.icon}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className=" text-sm text-muted-foreground  ">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className=" p-20  flex flex-col items-center justify-center">
        <div className="w-1/2 space-y-11 ">
          <h2 className="text-3xl font-bold">
            You really will not need another task manager.
          </h2>
          <p className="text-sm ">
            Basel redefines productivity with its intuitive interface, robust
            task management, and seamless collaboration features. Whether you're
            an individual striving for efficiency or a team aiming for cohesion,
            our platform adapts to your needs. Say goodbye to scattered
            workflows and missed deadlines
          </p>
          <div>
            {taskManagerFeatures.map((task) => {
              return (
                <div className="mb-5">
                  <div className="text-emerald-400 flex items-center justify-start">
                    {" "}
                    <h2 className="  text-lg font-bold "> {task.title}</h2>{" "}
                  </div>
                  <p className="text-sm text-muted-foreground ">
                    {task.description}
                  </p>
                </div>
              );
            })}
          </div>
          <Button className="" variant={"outline"}>
            {" "}
            <RocketIcon
              className="mr-2 h-4 w-4"
              onClick={() => {
                router.push("/login");
              }}
            />{" "}
            Try for free now
          </Button>
        </div>
      </div>
    </>
  );
}
