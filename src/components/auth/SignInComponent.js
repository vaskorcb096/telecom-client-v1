"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { Button } from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import CommonInput from "../../components/common/input/CommonInput";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SignInComponent = () => {
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    role: "",
    phone: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    const { phone, password } = formData;

    if (!phone || !password) {
      setLoading(false)
      return toast.error('Phone and Password is required')
    }

    const loginData = await signIn("credentials", {
      redirect: false,
      phone: phone,
      password: password,
      // userType: router.asPath === "/auth/ad-log-in" ? "admin" : data.user_type,
    });

    loginData.status === 401 && toast.error('Phone or Password does not match')
    loginData.status === 200 && toast.success('LoggedIn successfully')
    setLoading(false)
  };

  return (
    <div className="max-w-[600px] rounded-large mx-auto border p-3 sm:p-7 mt-6 sm:mt-12">
      <h1 className="text-md sm:text-xl font-extrabold text-neutral mb-1 text-center">
        Welcome to Choity Telecom
      </h1>
      <p className="text-xs sm:text-base sm:leading-[22.4px] text-neutral-800 mb-6 text-center">
        Let’s get back to your account
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
        <CommonInput
          type="text"
          label="Phone"
          placeholder="Enter customer phone no"
          labelPlacement="outside"
          size={isMobile ? "md" : "lg"}
          labelTextSize={isMobile ? "text-xs" : "text-sm"}
          inputTextSize={isMobile ? "text-xs" : "text-sm"}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          errorMessage={errors.phone}
        />

        <CommonInput
          label="Password"
          variant="bordered"
          labelPlacement="outside"
          placeholder="Your password"
          size={isMobile ? "md" : "lg"}
          type={isVisible ? "text" : "password"}
          labelTextSize={isMobile ? "text-xs" : "text-sm"}
          inputTextSize={isMobile ? "text-xs" : "text-sm"}
          endContent={
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? (
                <EyeSlashIcon
                  className="w-5 text-neutral-600"
                  aria-hidden="true"
                />
              ) : (
                <EyeIcon className="w-5 text-neutral-600" aria-hidden="true" />
              )}
            </button>
          }
          name="password"
          value={formData.password}
          onChange={handleChange}
          errorMessage={errors.password}
        />

        <Button
          type="submit"
          color="primary"
          size="lg"
          radius="sm"
          isLoading={loading}
          className="hover:bg-primary-600 text-base font-bold text-neutral-100 w-full mt-4 mb-4"
        >
          Sign In
        </Button>
      </form>

      <div>
        <p className="text-xs sm:text-sm text-center text-neutral-900">
          Don’t have an account yet?
          <Link href="/auth/sign-up" className="text-primary font-medium ml-1">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInComponent;
