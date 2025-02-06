import React from 'react'
import Gallery from '@/app/components/Gallery'
import { getProductDetails } from "@/lib/action"
import ProductInfo from '@/app/components/ProductInfo'

const ProductDetails = async ({ params }: { params: { productId: string } }) => {
  const productDetails = await getProductDetails(params.productId)
  console.log(productDetails)
  return (
    <div className='flex justify-center items-start gap-16 py-10 px-5 max-md:flex-col max-md:items-center'>
      <Gallery productImage={productDetails?.images || []} />
      <ProductInfo productInfo={productDetails} />
    </div>
  )
}

export default ProductDetails
