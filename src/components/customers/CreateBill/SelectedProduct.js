"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";
import { TrashIcon } from "@heroicons/react/24/outline";

const SelectedProduct = ({
  selectedProduct,
  handlePrice,
  handleQtyChange,
  handleRemoveItem,
  price,
  quantity,
}) => {
  // const [products, setProduct] = useState(selectedProduct);
  // console.log("productsproductsproducts", products);
  // useEffect(() => {
  //   let uniqueArray = [...new Set(selectedProduct)];
  //   setProduct(uniqueArray);
  // }, [selectedProduct]);
  const columns = [
    { name: "Product Name", uid: "product_name", sortable: true },
    { name: "In stock", uid: "in_stock", sortable: true },
    { name: "Total Qty", uid: "Total_Qty", sortable: true },
    { name: " Price", uid: "Price", sortable: true },
    { name: "Unit Price", uid: "Unit_Price", sortable: true },
    { name: "Total Price", uid: "Total_Price", sortable: true },
    { name: "Action", uid: "Action" },
  ];

  return (
    <div className="mt-4">
      <Divider className=" mb-6" />
      {selectedProduct?.length === 0 ? (
        <p>Your product card is empty</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              {columns.map((col, index) => {
                return (
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    {col.name}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {selectedProduct.map((product) => (
              <tr key={product._id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                  {product?.product_name}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                  {Number(product?.quantity) -
                    Number(quantity[product?._id] ? quantity[product?._id] : 0)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <Input
                    value={quantity[product?._id]}
                    onChange={(e) => handleQtyChange(e, product)}
                    size="sm"
                    className="w-16"
                    min={1}
                    max={product?.quantity}
                    variant="bordered"
                    classNames={{
                      innerWrapper: "ml-3",
                    }}
                    type="number"
                    labelPlacement="outside"
                  />
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                  {product?.price}
                </td>

                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <Input
                    size="sm"
                    className="w-24"
                    min={1}
                    value={
                      price[product?._id] === NaN ? 0 : price[product?._id]
                    }
                    onChange={(e) => handlePrice(e, product)}
                    max={product?.price}
                    variant="bordered"
                    placeholder="Price"
                    classNames={{
                      innerWrapper: "ml-3",
                    }}
                    type="number"
                    labelPlacement="outside"
                  />
                </td>

                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {price[product?._id] === undefined ||
                  quantity[product?._id] === undefined
                    ? 0
                    : price[product?._id] * quantity[product?._id]}
                </td>

                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <Button
                    isIconOnly
                    size="sm"
                    radius="sm"
                    color="danger"
                    aria-label="Like"
                  >
                    <TrashIcon
                      onClick={() => handleRemoveItem(product?._id)}
                      height={16}
                    />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Divider className="my-3" />
    </div>
  );
};

export default SelectedProduct;
