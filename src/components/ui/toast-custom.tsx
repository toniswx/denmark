import React from 'react'
import { Button } from './button'
import { Loader2 } from "lucide-react"
function LoadingToast() {
  return (
    <div className='w-96 h-11 rounded-md'>
       <Button className='w-full h-full cursor-progress '  >       <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading, please wait... </Button>
    </div>
  )
}

export default LoadingToast