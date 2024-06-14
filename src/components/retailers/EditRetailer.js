import toast from 'react-hot-toast';
import React, { useState } from 'react'
import { Button } from '@nextui-org/react';
import { useMediaQuery } from 'react-responsive';
import { trimObjectValues } from '@/utils/TrimUtils';
import axiosInstance from '@/services/axiosInstance';
import CommonInput from '../common/input/CommonInput';

const EditRetailer = ({ selectedRetailer, onClose, setRetailers }) => {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [formData, setFormData] = useState({
        retailer_name: selectedRetailer.retailer_name || "",
        phone: selectedRetailer.phone || "",
        email: selectedRetailer.email || "",
        company_name: selectedRetailer.company_name || "",
        address: selectedRetailer.address || "",
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

        const { retailer_name, phone, company_name, address } = formData;
        const newErrors = {};

        if (!retailer_name.trim()) {
            newErrors.retailer_name = "Retailer name is required";
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        if (!company_name.trim()) {
            newErrors.company_name = "Company name is required";
        }

        if (!address.trim()) {
            newErrors.address = "Address is required";
        }

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            const trimmedFormData = trimObjectValues(formData);

            axiosInstance
                .patch(`/retailers/${selectedRetailer._id}`, trimmedFormData)
                .then(res => {
                    toast.success(res.data.message);
                    setRetailers(res.data.payload.retailers)
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
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5'>
                <CommonInput
                    isRequired={true}
                    type='text'
                    label='Retailer Name'
                    placeholder='Enter retailer name'
                    labelPlacement='outside'
                    size={isMobile ? "md" : "lg"}
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='retailer_name'
                    value={formData.retailer_name}
                    onChange={handleChange}
                    errorMessage={errors.retailer_name}
                />

                <CommonInput
                    isRequired={true}
                    type='text'
                    label='Company name'
                    placeholder='Enter retailer company name'
                    labelPlacement='outside'
                    size={isMobile ? "md" : "lg"}
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='company_name'
                    value={formData.company_name}
                    onChange={handleChange}
                    errorMessage={errors.company_name}
                />

                <CommonInput
                    isRequired={true}
                    type='text'
                    label='Phone Number'
                    placeholder='Enter retailer phone'
                    labelPlacement='outside'
                    size={isMobile ? "md" : "lg"}
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    errorMessage={errors.phone}
                />

                <CommonInput
                    type='text'
                    label='Email (Optional)'
                    placeholder='Enter retailer email'
                    labelPlacement='outside'
                    size={isMobile ? "md" : "lg"}
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                />

                <CommonInput
                    isRequired={true}
                    type='text'
                    label='Address'
                    placeholder='Enter retailer address'
                    labelPlacement='outside'
                    size={isMobile ? "md" : "lg"}
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    errorMessage={errors.address}
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

export default EditRetailer