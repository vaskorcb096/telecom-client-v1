import toast from 'react-hot-toast';
import React, { useState } from 'react'
import { Button } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useMediaQuery } from 'react-responsive';
import { trimObjectValues } from '@/utils/TrimUtils';
import axiosInstance from '@/services/axiosInstance';
import CommonInput from '../common/input/CommonInput';

const AddCategory = ({ onClose, setCategories }) => {
    const session = useSession()
    const [loading, setLoading] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        category_name: "",
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

        const { category_name } = formData;
        const newErrors = {};

        if (!category_name.trim()) {
            newErrors.category_name = "Category name is required";
        } else if (category_name.length < 3) {
            newErrors.category_name = "Category name must be at least 2 characters length";
        }

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            const trimmedFormData = trimObjectValues(formData);

            axiosInstance
                .post('/categories', trimmedFormData)
                .then(res => {
                    toast.success(res.data.message);
                    setCategories(res.data.payload.categories)
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
                label='Category Name'
                placeholder='Enter category name'
                labelPlacement='outside'
                size={isMobile ? "md" : "lg"}
                labelTextSize={isMobile ? "text-xs" : "text-sm"}
                inputTextSize={isMobile ? "text-xs" : "text-sm"}
                name='category_name'
                value={formData.category_name}
                onChange={handleChange}
                errorMessage={errors.category_name}
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

export default AddCategory