export default async function getTeam(props:{projectId:string}) {
  console.log("render")
  const data = await fetch("http://localhost:3030/team/"+props.projectId, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  });

  
  return  data.json();
}
