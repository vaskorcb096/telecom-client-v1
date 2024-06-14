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
  Chip,
  Spinner,
} from "@nextui-org/react";
import { columns } from "./data";
import OrderDetails from "./OrderDetails";
import axiosInstance from "@/services/axiosInstance";
import { EyeIcon } from "@heroicons/react/24/outline";
import ModalWrapper from "../common/modal/ModalWrapper";
import React, { useCallback, useMemo, useState } from "react";
import { SearchIcon } from "../../../public/assets/icons/SearchIcon";

const INITIAL_VISIBLE_COLUMNS = [
  "invoiceNo",
  "customer",
  "totalAmount",
  "discount",
  "payment_method",
  "receiveAmount",
  "due_amount",
  "created_at",
  "action",
];
const INITIAL_VISIBLE_COLUMNS_PROFIT = [
  "invoiceNo",
  "customer",
  "totalAmount",
  "receiveAmount",
  "due_amount",
  "profit",
  "loss",
];

export default function SalesComponent({
  salesData,
  companyId,
  role,
  cmp = "none",
}) {
  const [orders, setOrders] = useState(salesData.sales);
  console.log(orders)
  const [selectedItem, setSelectedItems] = useState();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [selectedOrder, setSelectedOrder] = useState({});
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(
      cmp === "none" ? INITIAL_VISIBLE_COLUMNS : INITIAL_VISIBLE_COLUMNS_PROFIT
    )
  );
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const { totalPages, currentPage } = salesData.pagination;

  const handleViewOrders = (orders) => {
    onOpen();
    setSelectedOrder(orders.products);
    setSelectedItems(orders);
  };
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const handlePageChange = async (newPage) => {
    setLoading(true);
    axiosInstance
      .get(`/sales/${companyId}?page=${newPage}&limit=8&role=${role}`)
      .then((res) => {
        setLoading(false);
        setOrders(res.data.payload.sales);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setLoading(true);
      axiosInstance
        .get(`/sales/${companyId}?page=1&limit=8&search=${value}&role=${role}`)
        .then((res) => {
          setLoading(false);
          setOrders(res.data.payload.sales);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    axiosInstance
      .get(
        `/sales/${companyId}?page=1&limit=8&search=${filterValue}&role=${role}`
      )
      .then((res) => {
        setLoading(false);
        setOrders(res.data.payload.sales);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const renderCell = useCallback((orders, columnKey) => {
    switch (columnKey) {
      case "invoiceNo":
        return <b className="text-sm">#IN-{orders[columnKey]}</b>;
      case "customer":
        return orders["customer"]?.customer_name;

      case "created_at":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">
            {new Date(orders["createdAt"])
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}
          </p>
        );

      case "due_amount":
        return (
          orders["totalAmount"] - (orders["receiveAmount"] + orders["discount"])
        );
      case "payment_method":
        return (
          <Chip
            size="sm"
            radius="sm"
            className={`px - 3 p-1 rounded-md text-xs text-white font-bold uppercase whitespace-nowrap ${
              orders[columnKey] === "cash"
                ? "text-primary-900 bg-primary-300"
                : "text-danger-800 bg-danger-200"
            }`}
          >
            {orders[columnKey]}
          </Chip>
        );

      case "action":
        return (
          <Button
            size="sm"
            color="primary"
            startContent={<EyeIcon height={16} />}
            onClick={() => handleViewOrders(orders)}
          >
            View Details
          </Button>
        );

      case "profit":
        return orders?.total_profit_loss > 0 ? orders?.total_profit_loss : 0;
      case "loss":
        return orders?.total_profit_loss < 0 ? Math.abs(orders?.total_profit_loss) : 0;
      default:
        return orders[columnKey];
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <Input
          size="xs"
          isClearable
          className="w-full sm:max-w-[25%]"
          placeholder="Search by customer name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
      </div>
    );
  }, [filterValue, visibleColumns, orders.length, hasSearchFilter]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={currentPage}
          total={totalPages}
          onChange={handlePageChange}
        />
      </div>
    );
  }, [totalPages, currentPage]);

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
              className="uppercase"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No sales data found"}
          items={orders}
          loadingContent={<Spinner />}
          isLoading={loading}
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ModalWrapper
        size="3xl"
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title="Order Details"
        content={
          <OrderDetails
            company={selectedItem?.company._id}
            invoiceNo={selectedItem?.invoiceNo}
            createdAt={selectedItem?.createdAt}
            selectedOrder={selectedOrder}
            totalAmount={selectedItem?.totalAmount}
            discount={selectedItem?.discount}
            payment_method={selectedItem?.payment_method}
            receiveAmount={selectedItem?.receiveAmount}
          />
        }
        onActionButton={() => onClose()}
      />
    </div>
  );
}
