'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './button'
function FailSession() {
    const router = useRouter()
  return (
    <div className="h-screen  flex items-center justify-center flex-col">
    <div className="">
      {" "}
      <h2 className="text-2xl font-semibold">Your session has failed</h2>
      <p className="text-muted-foreground text-xs">Please log in again to be able to see this task</p>
      <Button variant={'link'}  onClick={()=>{
        router.push("/")
      }}  className="w-full">Back</Button>
    </div>
  </div>  )
}

export default FailSession