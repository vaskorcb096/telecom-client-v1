'use client'

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import axiosInstance from '@/services/axiosInstance'
import SalesComponent from '@/components/sales/Sales'
import { authOptions } from '../api/auth/[...nextauth]/route'

const Sales = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const products = await axiosInstance.get(
    `/products/${session?.user?._id}?page=1&limit=1000`
  )

  const customers = await axiosInstance.get(`/customers/${session?.user?._id}`)

  return (
    <SalesComponent
      productData={products?.data?.payload}
      customers={customers?.data?.payload?.customers}
    ></SalesComponent>
  )
}

export default Sales
