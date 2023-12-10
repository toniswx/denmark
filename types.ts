export type ApiResponse = {
  status: "fail" | "success";
  data: null | newAccountUserObject;
  message: string;
};

export type newAccountUserObject = user;


export type sessionApiCall = {
  data:user,
  status:string,
  message:string

}

type team = {
  id:string,
  invite_link:string,
  users:user[],
  tasks:task[],
  closed_tasks:task[]
}
type user = {
  name:string,
  password:string,
  email:string,
  teams:team[],
}

type task = {
  title:string,
  description:string,
  comments:comment[]
}


type comment = [
  owner:string,
  id:string,
  comment:string,
  date: Date,

]