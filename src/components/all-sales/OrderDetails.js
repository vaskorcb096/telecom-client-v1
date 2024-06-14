import { useState } from 'react'
import ReturnProduct from './ReturnProduct'
import ModalWrapper from '../common/modal/ModalWrapper'
import { Button, Divider, useDisclosure } from '@nextui-org/react'

const OrderDetails = ({
  company,
  selectedOrder,
  invoiceNo,
  createdAt,
  totalAmount,
  discount,
  payment_method,
  receiveAmount
}) => {
  console.log(selectedOrder)
  const [returnData, setReturnData] = useState({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleReturnProduct = order => {
    onOpen()
    setReturnData(order)
  }

  return (
    <div>
      <p className='mb-5 border p-3 rounded bg-neutral-200'>
        <b>Order Details:</b> Invoice No-{' '}
        <b>
          {invoiceNo} [
          {new Date(createdAt)
            .toLocaleDateString('en-GB')
            .split('/')
            .reverse()
            .join('-')}
          ]
        </b>
      </p>

      <Divider className='mb-2' />
      <div className='flex flex-row text-sm font-bold px-2'>
        <p className='basis-1/4'>Item</p>
        <p className='basis-1/4'>Quantity</p>
        <p className='basis-1/4'>Unit Cost</p>
        <p className='basis-1/4'>Total</p>
        <p className='basis-1/4'>Action</p>
      </div>
      <Divider className='mt-2' />

      {selectedOrder
        .filter(order => order?.product_quantity > 0)
        .map((order, index) => {
          return (
            <div key={index}>
              <div className='flex flex-row text-sm border-b px-2 py-3'>
                <p className='basis-2/4 flex items-center'>
                  {order?.product?.product_name}
                </p>
                <p className='basis-2/4 flex items-center'>
                  {order?.product_quantity}
                </p>
                <p className='basis-2/4 flex items-center'>
                  {isNaN(order?.product_price) ? '0' : order?.product_price}
                </p>
                <p className='basis-2/4 flex items-center'>
                  {order?.product_price * order?.product_quantity}
                </p>
                <div className='basis-2/4 flex items-center'>
                  <Button
                    size='sm'
                    color='primary'
                    onClick={() => handleReturnProduct(order)}
                  >
                    Return
                  </Button>
                </div>
              </div>
            </div>
          );
        })}


      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 mb-4'>
        <div>
          <p className='text-[40px] text-center p-1 font-medium border-4 border-dashed border-secondary-700 text-secondary-700 mb-2'>
            PAID
          </p>
          <p className='text-sm'>Created By: শান্ত</p>
        </div>
        <div className='flex flex-col'>
          <div>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <p className='font-semibold text-right'>Total</p>
              <p className='text-right'>৳ {totalAmount} Tk</p>
            </div>
            <Divider className='my-2' />
          </div>
          <div>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <p className='font-semibold text-right'>Discount</p>
              <p className='text-right'>৳ {discount} Tk</p>
            </div>
            <Divider className='my-2' />
          </div>

          <div>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <p className='font-semibold text-right capitalize'>
                {payment_method} Paid
              </p>
              <p className='text-right'>৳ {receiveAmount} Tk</p>
            </div>
            <Divider className='my-2' />
          </div>

          <div>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <p className='font-semibold text-right'>Due</p>
              <p className='text-right'>
                ৳ {totalAmount - (receiveAmount + discount)} Tk
              </p>
            </div>
            <Divider className='my-2' />
          </div>
        </div>
      </div>

      <ModalWrapper
        size='xl'
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title='Return Product Information'
        content={
          <ReturnProduct
            company={company}
            onClose={onClose}
            invoiceNo={invoiceNo}
            returnData={returnData}
          />
        }
        onActionButton={() => onClose()}
      />
    </div>
  )
}

export default OrderDetails
