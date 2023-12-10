import React from 'react'

function page({ params }: { params: { project: string } }) {

  
  return (
    <div>
        {params.project}
    </div>
  )
}

export default page