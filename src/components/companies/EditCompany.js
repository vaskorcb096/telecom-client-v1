import toast from 'react-hot-toast';
import React, { useState } from 'react'
import { Button } from '@nextui-org/react';
import { useMediaQuery } from 'react-responsive';
import { trimObjectValues } from '@/utils/TrimUtils';
import axiosInstance from '@/services/axiosInstance';
import CommonInput from '../common/input/CommonInput';

const EditCompany = ({ selectedCompany, onClose, setCompany }) => {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [formData, setFormData] = useState({
        name: selectedCompany.name || "",
        phone: selectedCompany.phone || "",
        email: selectedCompany.email || "",
        address: selectedCompany.address || "",
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

        const { name, phone, address } = formData;
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        if (!address.trim()) {
            newErrors.address = "Address is required";
        }

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            const trimmedFormData = trimObjectValues(formData);

            axiosInstance
                .patch(`/users/${selectedCompany._id}`, trimmedFormData)
                .then(res => {
                    toast.success(res.data.message);
                    setCompany(res.data.payload.users)
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
        <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5'>
                <CommonInput
                    isRequired={true}
                    type='text'
                    label='Company Name'
                    placeholder='Enter company name'
                    labelPlacement='outside'
                    size={isMobile ? "md" : "lg"}
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    errorMessage={errors.name}
                />

                <CommonInput
                    isRequired={true}
                    type='text'
                    label='Phone Number'
                    placeholder='Enter company phone'
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
                    placeholder='Enter company email'
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
                    placeholder='Enter company address'
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

export default EditCompany