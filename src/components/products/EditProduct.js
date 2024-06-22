import toast from 'react-hot-toast';
import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import CommonInput from '../common/input/CommonInput'
import axiosInstance from '@/services/axiosInstance';
import { Button, Select, SelectItem, Textarea } from '@nextui-org/react';

const EditProduct = ({ selectedProduct, onClose, setProducts, categories, brands, retailers }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        product_name: selectedProduct.product_name || "",
        category: selectedProduct.category || "",
        brand: selectedProduct.brand || "",
        price: selectedProduct.price || null,
        quantity: selectedProduct.quantity || null,
        retailer: selectedProduct.retailer || "",
        memo_ref: selectedProduct.memo_ref || "",
        item_type: selectedProduct.item_type || "",
        stock_out_alert: selectedProduct.stock_out_alert || null,
        description: selectedProduct.description || "",
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

        const { product_name, memo_ref } = formData;
        const newErrors = {};

        if (!product_name.trim()) {
            newErrors.product_name = "Product name is required";
        }

        if (!memo_ref.trim()) {
            newErrors.memo_ref = "Memo ref is required";
        }

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);

            axiosInstance
                .patch(`/products/${selectedProduct._id}`, formData)
                .then(res => {
                    toast.success(res.data.message);
                    setProducts(res.data.payload.products)
                    onClose()
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
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-4'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <CommonInput
                    type='text'
                    label={<p>Product Name <span className='text-danger text-md'>*</span></p>}
                    placeholder='Enter product pame'
                    labelPlacement='outside'
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='product_name'
                    value={formData.product_name}
                    onChange={handleChange}
                    errorMessage={errors.product_name}
                />

                <Select
                    label={<p>Retailer <span className='text-danger text-md'>*</span></p>}
                    defaultSelectedKeys={[formData.retailer._id]}
                    labelPlacement='outside'
                    variant='bordered'
                    placeholder='Select retailer'
                    radius='sm'
                    size='md'
                    name='retailer'
                    onChange={handleChange}
                    errorMessage={errors.retailer}
                    classNames={{
                        base: 'flex justify-start',
                        label: `text-sm pe-0 ${formData.retailer && 'pb-3'} ${errors.retailer ? 'pb-3' : ''}`,
                        trigger: "border-1 border-neutral-300",
                        value: 'text-sm'
                    }}
                >
                    {retailers.map(retailer => (
                        <SelectItem key={retailer._id}>{retailer.retailer_name}</SelectItem>
                    ))}
                </Select>

                <CommonInput
                    type='text'
                    label={<p>Memo Ref <span className='text-danger text-md'>*</span></p>}
                    placeholder='Enter memo ref '
                    labelPlacement='outside'
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='memo_ref'
                    value={formData.memo_ref}
                    onChange={handleChange}
                    errorMessage={errors.memo_ref}
                />

                <Select
                    label={<p>Product Category <span className='text-danger text-md'>*</span></p>}
                    defaultSelectedKeys={[formData.category._id]}
                    labelPlacement='outside'
                    variant='bordered'
                    placeholder='Select category'
                    radius='sm'
                    size='md'
                    name='category'
                    value={formData.category}
                    onChange={handleChange}
                    errorMessage={errors.category}
                    classNames={{
                        base: 'flex justify-start',
                        label: `text-sm pe-0 ${formData.category && 'pb-3'} ${errors.category ? 'pb-3' : ''}`,
                        trigger: "border-1 border-neutral-300",
                        value: 'text-sm'
                    }}
                >
                    {categories.map(category => (
                        <SelectItem key={category._id}>{category.category_name}</SelectItem>
                    ))}
                </Select>

                <Select
                    label={<p>Product Brand <span className='text-danger text-md'>*</span></p>}
                    defaultSelectedKeys={[formData.brand._id]}
                    labelPlacement='outside'
                    variant='bordered'
                    placeholder='Select brand'
                    radius='sm'
                    size='md'
                    name='brand'
                    onChange={handleChange}
                    errorMessage={errors.brand}
                    classNames={{
                        base: 'flex justify-start',
                        label: `text-sm pe-0 ${formData.brand && 'pb-3'} ${errors.brand ? 'pb-3' : ''}`,
                        trigger: "border-1 border-neutral-300",
                        value: 'text-sm'
                    }}
                >
                    {brands.map(brand => (
                        <SelectItem key={brand._id}>{brand.brand_name}</SelectItem>
                    ))}
                </Select>

                <Select
                    label={<p>Item Type <span className='text-danger text-md'>*</span></p>}
                    defaultSelectedKeys={[formData.item_type]}
                    labelPlacement='outside'
                    variant='bordered'
                    placeholder='Select item type'
                    radius='sm'
                    size='md'
                    name='item_type'
                    onChange={handleChange}
                    errorMessage={errors.item_type}
                    classNames={{
                        base: 'flex justify-start',
                        label: `text-sm pe-0 ${formData.item_type && 'pb-3'} ${errors.item_type ? 'pb-3' : ''}`,
                        trigger: "border-1 border-neutral-300",
                        value: 'text-sm'
                    }}
                >
                    <SelectItem>Unit</SelectItem>
                    <SelectItem>Piece</SelectItem>
                </Select>

                <CommonInput
                    type='number'
                    label={<p>Price <span className='text-danger text-md'>*</span></p>}
                    placeholder='Enter price'
                    labelPlacement='outside'
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='price'
                    value={formData.price}
                    onChange={handleChange}
                    errorMessage={errors.price}
                />

                <CommonInput
                    type='number'
                    label={<p>Quantity <span className='text-danger text-md'>*</span></p>}
                    placeholder='Enter quantity'
                    labelPlacement='outside'
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='quantity'
                    value={formData.quantity}
                    onChange={handleChange}
                    errorMessage={errors.quantity}
                />

                <CommonInput
                    type='number'
                    label={<p>StockOut Alert <span className='text-danger text-md'>*</span></p>}
                    placeholder='Enter Stock Out Alert'
                    labelPlacement='outside'
                    labelTextSize={isMobile ? "text-xs" : "text-sm"}
                    inputTextSize={isMobile ? "text-xs" : "text-sm"}
                    name='stock_out_alert'
                    value={formData.stock_out_alert}
                    onChange={handleChange}
                    errorMessage={errors.stock_out_alert}
                />
            </div>

            <Textarea
                label="Description (Optional)"
                labelPlacement="outside"
                variant="bordered"
                placeholder="Enter your description"
                disableAutosize
                classNames={{
                    inputWrapper: 'border-1',
                    input: "resize-y min-h-[100px]",
                }}
                name='description'
                value={formData.description}
                onChange={handleChange}
            />

            <div className='flex gap-2 justify-end mt-4'>
                <Button
                    type='submit'
                    color='primary'
                    size='md'
                    radius='sm'
                    isLoading={loading}
                    className='hover:bg-primary-600 text-base font-medium text-neutral-100'
                >
                    Submit
                </Button>
                <Button
                    type='button'
                    size='md'
                    radius='sm'
                    className='text-base font-medium text-neutral-100'
                    onClick={() => onClose()}
                >
                    Close
                </Button>
            </div>
        </form>
    )
}

export default EditProduct