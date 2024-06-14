"use client";
import React, { useState, useMemo } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";
import { columns, products } from "../products/data";

const INITIAL_VISIBLE_COLUMNS = ["product_name", "category", "brand", "price", "retailer"];

const LatestTransaction = () => {
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const rowsPerPage = 10;

  const pages = Math.ceil(products.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return products.slice(start, end);
  }, [page, products]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "product_name":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">{cellValue}</p>
        );
      case "category":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">{cellValue}</p>
        );
      case "brand":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">{cellValue}</p>
        );
      case "price":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">{cellValue}</p>
        );
      case "retailer":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">{cellValue}</p>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <Table
      aria-label="Example table with custom cells"
      bottomContentPlacement="outside"
      bottomContent={
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
      }
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
      <TableBody items={products}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default LatestTransaction;
