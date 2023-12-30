export default async function getTeam(props:{projectId:string}) {
  console.log("render")
  const data = await fetch("https://basel-ru5b.vercel.app/team/"+props.projectId, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  });

  
  return  data.json();
}
