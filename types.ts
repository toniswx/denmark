export type ApiResponse = {
  status: "fail" | "success";
  data: null | newAccountUserObject;
  message: string;
};

export type newAccountUserObject = user;

export type sessionApiCall<T> = {
  data: T;
  status: string;
  message: string;
};

export type team = {
  teamName: string;
  teamId: string;
  invite_link: string;
  users: user[];
  tasks: task[];
  closed_tasks: task[];
};
export type user = {
  id: string;
  _id?: string;
  name: string;
  password: string;
  email: string;
  teams: team[];
};

export type task = {
  teamId:string
  id: string;
  title: string;
  description: string;
  status: "Completed" | "To-do" | "On-going" | "Closed";
  priority: "High" | "Medium" | "Low" | "Urgent" | "Important" | "Normal";
  comments: comment[];
  admins:string[],
  createdBy:{
    name:string,
    id:string,
    time: Date
  }
  feed:{
    id: string;
    action: string;
    time: Date;
    name: string;
  }[]
};

export type comment = { owner: string; id: string; text: string; date: Date };
