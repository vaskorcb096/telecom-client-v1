"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  useDisclosure,
  Spinner,
  getKeyValue,
} from "@nextui-org/react";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  EyeIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { SearchIcon } from "../../../../public/assets/icons/SearchIcon";
import ModalWrapper from "@/components/common/modal/ModalWrapper";

export default function CreateBillProductComponents({
  categories,
  brands,
  retailers,
  INITIAL_VISIBLE_COLUMNS,
  columns,
  handleStockChange,
  handleQtyChange,
  setSelectedProduct,
  selectedProduct,
  addItems,
  handleAddProduct,
  products,
  productData,
}) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [productArray, setProductArray] = useState(selectedProduct);

  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const people = [
    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      email: "lindsay.walton@example.com",
      role: "Member",
    },
    // More people...
  ];

  const renderCell = useCallback(
    (product, columnKey) => {
      const cellValue = product[columnKey];

      switch (columnKey) {
        case "action":
          return (
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => handleAddProduct(product)}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                Add
              </button>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [products]
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {product._id}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {product.product_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {product.price}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <Button
                        isIconOnly
                        size="sm"
                        radius="sm"
                        color="secondary"
                        aria-label="Like"
                        onClick={() => handleAddProduct(product)}
                      >
                        <PlusCircleIcon height={22} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
