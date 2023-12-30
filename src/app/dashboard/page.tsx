import React from 'react'
import LoadingToast from '@/components/ui/toast-custom'
function page() {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col absolute ">
   
     <div className="bottom-0 absolute left-0 m-6">
      <LoadingToast />
    </div>
  </div>
  )
}

export default page