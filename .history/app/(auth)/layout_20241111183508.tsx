import React from 'react'
import Image from 'next/image'

const layout = ({children}:{children:React.ReactDOM}) => {
  return (
    <div className='flex min-h-screen'>
        <section>
            <div>
                <Image 
                src="/favicon.ico"
                alt="logo" width={16} height={16} className="">

                </Image>
            </div>
        </section>
    </div>
  )
}

export default layout