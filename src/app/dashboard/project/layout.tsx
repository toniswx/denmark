import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-screen overflow-y-scroll w-full '>
        {children}
    </div>
  )
}

export default layout