import toast from 'react-hot-toast';
import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import { trimObjectValues } from '@/utils/TrimUtils';
import axiosInstance from '@/services/axiosInstance';
import CommonInput from '../common/input/CommonInput';
import { Button, Select, SelectItem } from '@nextui-org/react';

const paymentType = [
    { label: "Bank Transfer", value: "bank" },
    { label: "On Cash", value: "cash" },
    { label: "Bkash", value: "bkash" }
]

const AddLedger = ({ onClose, companyId, retailerId, setLedgers, setModalType }) => {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [formData, setFormData] = useState({
        payment_type: "",
        amount: "",
        company: companyId,
        retailer: retailerId
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { payment_type, amount } = formData;
        const newErrors = {};

        if (!payment_type.trim()) {
            newErrors.payment_type = "Payment type is required";
        }

        if (!amount.trim()) {
            newErrors.amount = "Amount is required";
        }

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            const trimmedFormData = trimObjectValues(formData);

            axiosInstance
                .post('/retailers/add-ledger', trimmedFormData)
                .then(res => {
                    toast.success(res.data.message);
                    setLedgers(res.data.payload.ledgers)
                    setModalType('ledger')
                })
                .catch(err => {
                    toast.error(err.response.data.message);
                })
                .finally(() => {
                    setLoading(false);
                });

            setErrors({});
        } else {
            setErrors(newErrors);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-2'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5'>
                <Select
                    label={<p>Select Payment Type</p>}
                    labelPlacement='outside'
                    variant='bordered'
                    placeholder='Select Payment Type'
                    radius='sm'
                    size='md'
                    name='payment_type'
                    onChange={handleChange}
                    errorMessage={errors.payment_type}
                    classNames={{
                        trigger: "border-1 border-neutral-300",
                        label: `text-sm pe-0 ${formData.payment_type && 'pb-0'} ${errors.payment_type ? 'pb-3' : ''}`,
                    }}
                >
                    {paymentType.map(type => (
                        <SelectItem key={type.value}>{type.label}</SelectItem>
                    ))}
                </Select>

                <CommonInput
                    type='number'
                    label='Amount'
                    placeholder={null}
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">Tk</span>
                        </div>
                    }
                    labelPlacement='outside'
                    size="md"
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='amount'
                    value={formData.amount}
                    onChange={handleChange}
                    errorMessage={errors.amount}
                />
            </div>

            <div className='flex gap-2 justify-end'>
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
                <Button
                    type='button'
                    size='md'
                    radius='sm'
                    className='text-base font-medium text-neutral-100 px-6'
                    onClick={() => onClose()}
                >
                    Close
                </Button>
            </div>
        </form>
    )
}

export default AddLedger