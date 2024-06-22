import toast from 'react-hot-toast'
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/services/axiosInstance'
import { Button, Input, Textarea } from '@nextui-org/react'

const ReturnProduct = ({ company, invoiceNo, returnData, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(
    returnData.product_price * returnData.product_quantity
  )

  const [formData, setFormData] = useState({
    invoiceNo: invoiceNo,
    company: company,
    product: returnData.product._id,
    quantity: returnData.product_quantity || "",
    price: returnData.product_price,
    total_price: '',
    returnReason: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    setTotalPrice(formData.quantity * returnData.product_price)
  }, [formData.quantity])

  const handleSubmit = e => {
    const returnSubmitData = { ...formData, total_price: formData.quantity * returnData.product_price }
    e.preventDefault()
    setLoading(true)

    axiosInstance
      .post('/sales/return-product', returnSubmitData)
      .then(res => {
        toast.success(res.data.message)
      })
      .catch(err => {
        toast.error(err.response.data.message)
      })
      .finally(() => {
        onClose()
        setLoading(false)
      })
  }

  return (
    <div className='mt-1'>
      <b>{returnData.product.product_name}</b>
      <span className='ml-2'>
        ({returnData.product_price} X {returnData.product_quantity}) ={' '}
        {returnData.product_price * returnData.product_quantity} Tk
      </span>
      <form onSubmit={handleSubmit}>
        <div className='flex gap-5 mt-6 mb-4'>
          <Input
            value={returnData.product_price}
            size='md'
            min={1}
            max={10}
            label='Unit Price'
            variant='bordered'
            radius='sm'
            classNames={{
              label: 'text-sm'
            }}
            disabled
            labelPlacement='outside'
          />
          <Input
            name='quantity'
            value={formData.quantity}
            onChange={handleChange}
            size='md'
            min={1}
            max={returnData.product_quantity}
            label='Quantity'
            variant='bordered'
            radius='sm'
            classNames={{
              label: 'text-sm'
            }}
            type='number'
            labelPlacement='outside'
          />
          <Input
            value={totalPrice}
            size='md'
            min={1}
            max={10}
            label='Total'
            variant='bordered'
            radius='sm'
            classNames={{
              label: 'text-sm'
            }}
            disabled
            labelPlacement='outside'
          />
        </div>

        <Textarea
          label='Write Return Reason'
          labelPlacement='outside'
          variant='bordered'
          placeholder=''
          radius='sm'
          disableAutosize
          maxRows={2}
          classNames={{
            inputWrapper: 'border-2',
            input: 'resize-y min-h-[100px]'
          }}
          name='returnReason'
          value={formData.returnReason}
          onChange={handleChange}
        />

        <div className='flex gap-2 justify-end mt-2'>
          <Button
            type='button'
            size='md'
            className='text-base font-medium bg-neutral-700 text-neutral-100 mt-6 mb-4 rounded-md'
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            color='primary'
            size='md'
            isLoading={loading}
            className='hover:bg-primary-600 text-base font-medium text-neutral-100 mt-6 mb-4 rounded-md'
          >
            Submit Return
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ReturnProduct
