'use client'

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import axiosInstance from '@/services/axiosInstance'
import { authOptions } from '../api/auth/[...nextauth]/route'
import ReturnProductComponent from '@/components/return-product/ReturnProductComponent'

const ReturnStatement = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const returnProducts = await axiosInstance.get(
    `/sales/return-product/${session?.user?._id}`
  )

  return (
    <ReturnProductComponent returnProducts={returnProducts?.data?.payload?.returnProducts} />
  )
}

export default ReturnStatement
