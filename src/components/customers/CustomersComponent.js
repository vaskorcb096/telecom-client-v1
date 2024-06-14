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
} from "@nextui-org/react";
import AddDue from "./AddDue";
import ViewDue from "./ViewDue";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import ModalWrapper from "../common/modal/ModalWrapper";
import React, { useCallback, useMemo, useState } from "react";
import { SearchIcon } from "../../../public/assets/icons/SearchIcon";
import {
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const INITIAL_VISIBLE_COLUMNS = [
  "customer_name",
  "phone",
  "shop_name",
  "dueAmount",
  "address",
  "actions",
];

const columns = [
  { name: "CUSTOMER NAME", uid: "customer_name", sortable: true },
  { name: "PHONE", uid: "phone", sortable: true },
  { name: "SHOP NAME", uid: "shop_name", sortable: true },
  { name: "DUE AMOUNT", uid: "dueAmount", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export default function CustomersComponent({ customerData }) {
  const [customers, setCustomers] = useState(customerData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filterValue, setFilterValue] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const router = useRouter()
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const handleAddCustomer = () => {
    onOpen();
    setModalType("add-customer");
  };

  const handleEditCustomer = (user) => {
    onOpen();
    setModalType("edit-customer");
    setSelectedCustomer(user);
  };

  const handleAddDue = () => {
    onOpen();
    setModalType("add-due");
  };

  const handleViewDue = () => {
    onOpen();
    setModalType("view-due");
  };

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...customers];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [customers, filterValue]);

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

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "customer_name":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">
            {cellValue}
          </p>
        );
      case "phone":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">
            {cellValue}
          </p>
        );
      case "email":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">
            {cellValue}
          </p>
        );
      case "shop_name":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">
            {cellValue}
          </p>
        );
      case "address":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">
            {cellValue}
          </p>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-1">
            {/* <Button
              size="sm"
              color="warning"
              startContent={<PlusIcon height={18} strokeWidth={2} />}
              onClick={() => handleCreateBill(user._id)}
            >
              Create Bill
            </Button> */}
            <Button
              size="sm"
              color="secondary"
              startContent={<PlusIcon height={16} strokeWidth={2} />}
              onClick={handleAddDue}
            >
              Add Due
            </Button>
            <Button
              size="sm"
              color="default"
              startContent={<EyeIcon height={16} />}
              onClick={handleViewDue}
            >
              View Due
            </Button>
            <Button
              size="sm"
              color="primary"
              startContent={<PencilSquareIcon height={16} />}
              onClick={() => handleEditCustomer(user)}
            >
              Edit
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
    setFilterValue("");
    setPage(1);
  }, []);

  // const router = useRouter();

  // const handleCreateBill = (id) => {
  //   router.push(`/customers/create-bill?id=${id}`);
  // };

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
          <div className="flex gap-2">
            <Button
              size="md"
              color="primary"
              startContent={<PlusIcon height={18} strokeWidth={2} />}
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    customers.length,
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

  let modalContent = null;

  switch (modalType) {
    case "add-customer":
      modalContent = (
        <AddCustomer onClose={onClose} setCustomers={setCustomers} />
      );
      break;
    case "edit-customer":
      modalContent = (
        <EditCustomer
          selectedCustomer={selectedCustomer}
          onClose={onClose}
          setCustomers={setCustomers}
        />
      );
      break;
    case "add-due":
      modalContent = <AddDue onClose={onClose} />;
      break;
    case "view-due":
      modalContent = <ViewDue onClose={onClose} />;
      break;
    default:
      modalContent = null;
      break;
  }

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
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
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
        size="xl"
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title={
          modalType === "add-customer"
            ? "Add New Customer"
            : modalType === "edit-customer"
            ? "Edit Customer"
            : modalType === "add-due"
            ? "Add Previous Due"
            : modalType === "view-due"
            ? "Previous Due"
            : ""
        }
        content={modalContent}
        onActionButton={() => onClose()}
      />
    </div>
  );
}
