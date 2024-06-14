import toast from "react-hot-toast";
import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "react-responsive";
import { trimObjectValues } from "@/utils/TrimUtils";
import axiosInstance from "@/services/axiosInstance";
import CommonInput from "../common/input/CommonInput";

const AddCustomer = ({ onClose, setCustomers }) => {
  const session = useSession()
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    shop_name: "",
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

    const { customer_name, phone, address, shop_name } = formData;
    const newErrors = {};

    if (!customer_name.trim()) {
      newErrors.customer_name = "Name is required";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!shop_name.trim()) {
      newErrors.shop_name = "Shop name is required";
    }
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const trimmedFormData = trimObjectValues(formData);

      axiosInstance
        .post("/customers", trimmedFormData)
        .then((res) => {
          toast.success(res.data.message);
          setCustomers(res.data.payload.customers);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        })
        .finally(() => {
          onClose();
          setLoading(false);
        });

      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <CommonInput
          type='text'
          name='company'
          value={formData.company}
          onChange={handleChange}
          errorMessage={errors.company}
          className="hidden"
        />

        <CommonInput
          type="text"
          label="Customer Name"
          placeholder="Enter customer name"
          labelPlacement="outside"
          size={isMobile ? "md" : "lg"}
          labelTextSize={isMobile ? "text-xs" : "text-sm"}
          inputTextSize={isMobile ? "text-xs" : "text-sm"}
          name="customer_name"
          value={formData.customer_name}
          onChange={handleChange}
          errorMessage={errors.customer_name}
        />

        <CommonInput
          type="text"
          label="Phone Number"
          placeholder="Enter customer phone"
          labelPlacement="outside"
          size={isMobile ? "md" : "lg"}
          labelTextSize={isMobile ? "text-xs" : "text-sm"}
          inputTextSize={isMobile ? "text-xs" : "text-sm"}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          errorMessage={errors.phone}
        />

        {/* <CommonInput
          type="text"
          label="Email (Optional)"
          placeholder="Enter customer email"
          labelPlacement="outside"
          size={isMobile ? "md" : "lg"}
          labelTextSize={isMobile ? "text-xs" : "text-sm"}
          inputTextSize={isMobile ? "text-xs" : "text-sm"}
          name="email"
          value={formData.email}
          onChange={handleChange}
        /> */}

        <CommonInput
          type="text"
          label="Shop Name"
          placeholder="Enter Shop name"
          labelPlacement="outside"
          size={isMobile ? "md" : "lg"}
          labelTextSize={isMobile ? "text-xs" : "text-sm"}
          inputTextSize={isMobile ? "text-xs" : "text-sm"}
          name="shop_name"
          value={formData.shop_name}
          onChange={handleChange}
          errorMessage={errors.shop_name}
        />

        <CommonInput
          type="text"
          label="Shop Address"
          placeholder="Enter Shop address"
          labelPlacement="outside"
          size={isMobile ? "md" : "lg"}
          labelTextSize={isMobile ? "text-xs" : "text-sm"}
          inputTextSize={isMobile ? "text-xs" : "text-sm"}
          name="address"
          value={formData.address}
          onChange={handleChange}
          errorMessage={errors.address}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="submit"
          color="primary"
          size="md"
          radius="sm"
          isLoading={loading}
          className="hover:bg-primary-600 text-base font-medium text-neutral-100 px-6"
        >
          Submit
        </Button>
        <Button
          type="button"
          size="md"
          radius="sm"
          className="text-base font-medium text-neutral-100 px-6"
          onClick={() => onClose()}
        >
          Close
        </Button>
      </div>
    </form>
  );
};

export default AddCustomer;
