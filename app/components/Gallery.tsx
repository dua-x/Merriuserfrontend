
import React from 'react'
import Image from 'next/image'

const Gallery = ({ productImage }: { productImage: string[] }) => {
    return (
        <div className='flex flex-col gap-3 max-w[500px]'>Gallery
            <Image src={productImage[0]} width={500} height={500}
                alt='product' className='w-96 h-96 rounded-lg shadow-xl object-cover'
            />
            {/* <div className='flex gap-2 overflow-auto tailwind-scrollbar-hide'>
                {productImage.map((image, index)=> )}
            </div>  */}
        </div>
    )
}

export default Gallery