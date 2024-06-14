import React, { useState } from 'react'
import { Button } from '@nextui-org/react';
import { useMediaQuery } from 'react-responsive';
import CommonInput from '../common/input/CommonInput'

const AddDue = ({ onClose }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
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

        const { name } = formData;
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <CommonInput
                isRequired={true}
                type='number'
                label='If have any due in previews then add the amount.'
                placeholder={null}
                startContent={
                    <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">Tk</span>
                    </div>
                }
                labelPlacement='outside'
                size={isMobile ? "md" : "lg"}
                labelTextSize={isMobile ? "text-xs" : "text-sm"}
                inputTextSize={isMobile ? "text-xs" : "text-sm"}
                name='name'
                value={formData.name}
                onChange={handleChange}
                errorMessage={errors.name}
            />

            <div className='flex gap-2 justify-end'>
                <Button
                    type='submit'
                    color='primary'
                    size='md'
                    radius='sm'
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

export default AddDue