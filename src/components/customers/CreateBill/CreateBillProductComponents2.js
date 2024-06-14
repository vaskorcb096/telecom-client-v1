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
} from "@nextui-org/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useMemo, useState } from "react";
import { SearchIcon } from "../../../../public/assets/icons/SearchIcon";

const INITIAL_VISIBLE_COLUMNS = ["_id", "product_name", "price", "quantity", "actions"];

const columns = [
  { name: "CODE", uid: "_id", sortable: true },
  { name: "PRODUCT NAME", uid: "product_name", sortable: true },
  { name: "PRICE", uid: "price", sortable: true },
  { name: "QUANTITY", uid: "quantity", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export default function CreateBillProductComponents2({ products, handleAddProduct }) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "product_name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredProducts = [...products];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product.product_name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredProducts;
  }, [products, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "_id":
        return (
          <p className="text-bold text-small capitalize">{cellValue}</p>
        );
      case "product_name":
        return (
          <p className="text-bold text-small capitalize">{cellValue}</p>
        );
      case "quantity":
        return (
          <p className="text-bold text-small capitalize">{cellValue}</p>
        );
      case "price":
        return (
          <p className="text-bold text-small capitalize">{cellValue}</p>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-1">
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
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-center">
          <Input
            size="sm"
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    products.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <div>
      <Table
        isStriped
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[600px]",
        }}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
        showSelectionCheckboxes={false}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No products found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
