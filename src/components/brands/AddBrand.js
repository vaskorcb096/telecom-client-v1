import toast from 'react-hot-toast';
import React, { useState } from 'react'
import { Button } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useMediaQuery } from 'react-responsive';
import { trimObjectValues } from '@/utils/TrimUtils';
import axiosInstance from '@/services/axiosInstance';
import CommonInput from '../common/input/CommonInput';

const AddBrand = ({ onClose, setBrands }) => {
    const session = useSession()
    const [loading, setLoading] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        brand_name: "",
        company: session?.data?.user?._id
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

        const { brand_name } = formData;
        const newErrors = {};

        if (!brand_name.trim()) {
            newErrors.brand_name = "Brand name is required";
        } else if (brand_name.length < 3) {
            newErrors.brand_name = "Brand name must be at least 2 characters length";
        }

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            const trimmedFormData = trimObjectValues(formData);

            axiosInstance
                .post('/brands', trimmedFormData)
                .then(res => {
                    toast.success(res.data.message);
                    setBrands(res.data.payload.brands)
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
            <CommonInput
                type='text'
                name='company'
                value={formData.company}
                onChange={handleChange}
                errorMessage={errors.company}
                className="hidden"
            />

            <CommonInput
                type='text'
                label='Brand Name'
                placeholder='Enter brand name'
                labelPlacement='outside'
                size={isMobile ? "md" : "lg"}
                labelTextSize={isMobile ? "text-xs" : "text-sm"}
                inputTextSize={isMobile ? "text-xs" : "text-sm"}
                name='brand_name'
                value={formData.brand_name}
                onChange={handleChange}
                errorMessage={errors.brand_name}
            />

            <div className='flex gap-2 justify-end'>
                <Button
                    type='submit'
                    color='primary'
                    size='md'
                    radius='sm'
                    isLoading={loading}
                    className='hover:bg-primary-600 text-base font-medium text-neutral-100 mt-6 mb-4'
                >
                    Submit
                </Button>
                <Button
                    type='button'
                    size='md'
                    radius='sm'
                    className='text-base font-medium text-neutral-100 mt-6 mb-4'
                    onClick={() => onClose()}
                >
                    Close
                </Button>
            </div>
        </form>
    )
}

export default AddBrand