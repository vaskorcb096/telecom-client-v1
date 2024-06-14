import toast from 'react-hot-toast'
import { useMediaQuery } from 'react-responsive'
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/services/axiosInstance'
import CommonInput from '../common/input/CommonInput'
import { Button, Select, SelectItem } from '@nextui-org/react'

const paymentType = [
  { label: 'Bank Transfer', value: 'bank' },
  { label: 'Cash', value: 'cash' },
  { label: 'Bkash', value: 'bkash' }
]

const DuePayment = ({ selectedCustomer, onClose, setCustomers }) => {
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const [grandTotal, setGrandTotal] = useState(0)

  const [formData, setFormData] = useState({
    invoiceNo: '',
    paying_amount: '',
    payment_method: 'cash',
    due_amount: '',
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    setErrors({
      ...errors,
      [name]: ''
    })
  }

  useEffect(() => {
    if (formData.invoiceNo) {
      const selectedInvoice = selectedCustomer.invoiceList.find(
        invoice => invoice.invoiceNo === parseInt(formData.invoiceNo)
      )
      if (selectedInvoice) {
        setGrandTotal(selectedInvoice.dueAmount)

        setFormData({
          ...formData,
          due_amount: formData.paying_amount ? selectedInvoice.dueAmount - formData.paying_amount : selectedInvoice.dueAmount.toString()
        })
      }
    }
  }, [formData.invoiceNo, formData.paying_amount, selectedCustomer.invoiceList])

  const handleSubmit = e => {
    e.preventDefault()

    const { paying_amount } = formData

    const newErrors = {}

    if (!paying_amount.trim()) {
      newErrors.paying_amount = 'Paying amount is required'
    } else if (parseFloat(paying_amount) > grandTotal) {
      newErrors.paying_amount = `Paying amount cannot exceed ${grandTotal}`
    }

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const { due_amount, ...submitData } = formData

      axiosInstance
        .post('/customers/create-payment', submitData)
        .then(res => {
          toast.success(res.data.message);
          setCustomers(res.data.payload.customers)
        })
        .catch(err => {
          toast.error(err.response.data.message);
        })
        .finally(() => {
          onClose()
          setLoading(false);
        });

      setErrors({});
    } else {
      setErrors(newErrors);
    }

  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className='grid grid-cols-12 gap-4 mb-5'>
        <div className='col-span-5'>
          <Select
            label={
              <p>
                Select Invoice <span className='text-danger text-md'>*</span>
              </p>
            }
            labelPlacement='outside'
            variant='bordered'
            placeholder='Select Invoice'
            radius='sm'
            size={isMobile ? 'md' : 'lg'}
            name='invoiceNo'
            onChange={handleChange}
            errorMessage={errors.invoiceNo}
            disallowEmptySelection
            classNames={{
              base: 'flex justify-start',
              label: 'text-sm pe-0',
              trigger: 'border-1 border-neutral-300',
              value: 'text-sm'
            }}
          >
            {selectedCustomer?.invoiceList?.map(invoice => (
              <SelectItem key={invoice.invoiceNo} textValue={invoice.invoiceNo}>
                {invoice.invoiceNo}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className='col-span-7 flex justify-between bg-violet-100 h-12 mt-6 p-2.5 pt-3.5 rounded-small text-sm'>
          <p>Grand Total</p>
          <p>Tk {grandTotal}</p>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 mb-5'>
        <CommonInput
          type='number'
          label='Paying Amount'
          placeholder='Enter paid amounts'
          labelPlacement='outside'
          size={isMobile ? 'md' : 'lg'}
          labelTextSize={isMobile ? 'text-xs' : 'text-sm'}
          inputTextSize={isMobile ? 'text-xs' : 'text-sm'}
          name='paying_amount'
          value={formData.paying_amount}
          onChange={handleChange}
          errorMessage={errors.paying_amount}
        />

        <CommonInput
          isDisabled
          label='Due Amount'
          placeholder='Due Amount'
          labelPlacement='outside'
          size={isMobile ? 'md' : 'lg'}
          labelTextSize={isMobile ? 'text-xs' : 'text-sm'}
          inputTextSize={isMobile ? 'text-xs' : 'text-sm'}
          name='due_amount'
          value={formData.due_amount}
          onChange={handleChange}
        />

        <Select
          label={<p>Payment Type</p>}
          labelPlacement='outside'
          variant='bordered'
          placeholder='Select Payment Type'
          radius='sm'
          size='md'
          name='payment_method'
          onChange={handleChange}
          errorMessage={errors.payment_method}
          defaultSelectedKeys={['cash']}
          disallowEmptySelection
          classNames={{
            trigger: 'border-1 border-neutral-300',
            label: `text-sm pe-0 ${formData.payment_method && 'pb-0'} ${errors.payment_method ? 'pb-3' : ''
              }`
          }}
        >
          {paymentType.map(type => (
            <SelectItem key={type.value}>{type.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div className='flex gap-2 justify-end'>
        <Button
          type='button'
          size='md'
          radius='sm'
          color='danger'
          className='text-base font-medium text-neutral-100 px-6'
          onClick={() => onClose()}
        >
          Close
        </Button>
        <Button
          type='submit'
          color='primary'
          size='md'
          radius='sm'
          isLoading={loading}
          className='hover:bg-primary-600 text-base font-medium text-neutral-100 px-6'
        >
          Submit
        </Button>
      </div>
    </form>
  )
}

export default DuePayment
