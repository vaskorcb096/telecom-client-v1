"use client"

import Link from "next/link";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import CommonInput from "../../components/common/input/CommonInput";

const SignUpComponent = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
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

    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }
  }

  return (
    <div className='max-w-[600px] rounded-large mx-auto border p-3 sm:p-7 mt-6 sm:mt-12'>
      <h1 className='text-md sm:text-xl font-extrabold text-neutral mb-1 text-center'>
        Welcome to Choity Telecom
      </h1>
      <p className='text-xs sm:text-base sm:leading-[22.4px] text-neutral-800 mb-6 text-center'>
        Let’s get back to register an account
      </p>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <CommonInput
          isRequired={true}
          type='text'
          label='Customer Name'
          placeholder='Enter customer name'
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
          placeholder='Enter customer phone'
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
          placeholder='Enter customer email'
          labelPlacement='outside'
          size={isMobile ? "md" : "lg"}
          labelTextSize={isMobile ? "text-xs" : "text-sm"}
          inputTextSize={isMobile ? "text-xs" : "text-sm"}
          name='email'
          value={formData.email}
          onChange={handleChange}
          errorMessage={errors.email}
        />

        <CommonInput
          isRequired={true}
          type='text'
          label='Address'
          placeholder='Enter customer address'
          labelPlacement='outside'
          size={isMobile ? "md" : "lg"}
          labelTextSize={isMobile ? "text-xs" : "text-sm"}
          inputTextSize={isMobile ? "text-xs" : "text-sm"}
          name='address'
          value={formData.address}
          onChange={handleChange}
          errorMessage={errors.address}
        />

        <Button
          type='submit'
          color='primary'
          size='lg'
          radius='sm'
          className='hover:bg-primary-600 text-base font-bold text-neutral-100 w-full mt-4 mb-4'
        >
          Sign In
        </Button>
      </form>


      <div>
        <p className='text-xs sm:text-sm text-center text-neutral-900'>
          Already have an account?
          <Link
            href='/auth/sign-in'
            className='text-primary font-medium ml-1'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpComponent;
