import React from 'react'
import Image from 'next/image'

const layout = ({children}:{children:React.ReactDOM}) => {
  return (
    <div className='flex min-h-screen'>
        <section>
            <div>
                <Image 
                src="/favicon.ico"
                alt="logo" 
                width={16} height={16} className="h-auto">
                    <div className='space-y-5 text-white'>
                        <h1 className='h1'>anage your files the best way</h1>
                        <p className='body-1'>This is a place where you can stor all you documents.</p>

                    </div>
                </Image>
            </div>
        </section>
    </div>
  )
}

export default layout