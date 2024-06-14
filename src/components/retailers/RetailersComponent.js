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
import Ledger from "./Ledger";
import AddLedger from "./AddLedger";
import AddRetailer from "./AddRetailer";
import EditRetailer from "./EditRetailer";
import axiosInstance from "@/services/axiosInstance";
import ModalWrapper from "../common/modal/ModalWrapper";
import React, { useCallback, useMemo, useState } from "react";
import { SearchIcon } from "../../../public/assets/icons/SearchIcon";
import {
  EyeIcon,
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const INITIAL_VISIBLE_COLUMNS = [
  "retailer_name",
  "company_name",
  "phone",
  "email",
  "address",
  "createdAt",
  "actions",
];

const columns = [
  { name: "RETAILER NAME", uid: "retailer_name", sortable: true },
  { name: "COMPANY NAME", uid: "company_name", sortable: true },
  { name: "PHONE", uid: "phone", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "CREATED DATE", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export default function RetailersComponent({ retailerData, role }) {
  const [retailers, setRetailers] = useState(retailerData);
  const [companyId, setCompanyId] = useState("");
  const [retailerId, setRetailerId] = useState("");
  const [ledgers, setLedgers] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filterValue, setFilterValue] = useState("");
  const [selectedRetailer, setSelectedRetailer] = useState({});
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const handleAddRetailer = () => {
    onOpen();
    setModalType("add-retailer");
  };

  const handleLedgerList = (user) => {
    setCompanyId(user.company);
    setRetailerId(user._id);

    axiosInstance
      .get(
        `/retailers/ledgers/${user.company}/${user._id}?page=1&limit=8&role=${role}`
      )
      .then((res) => {
        onOpen();
        setModalType("ledger");
        setLedgers(res.data.payload.ledgers);
      });
  };

  const handleEditRetailer = (user) => {
    onOpen();
    setModalType("edit-retailer");
    setSelectedRetailer(user);
  };

  const handleUpdateLedger = () => {
    onOpen();
    setModalType("add-ledger");
  };

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...retailers];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.retailer_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [retailers, filterValue]);

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
      case "retailer_name":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">
            {cellValue}
          </p>
        );
      case "company_name":
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
      case "address":
        return (
          <p className="text-bold text-small capitalize whitespace-nowrap">
            {cellValue}
          </p>
        );
      case "createdAt":
        return (
          <p className="text-bold text-small capitalize">
            {new Date(cellValue)
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}
          </p>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-1">
            <Button
              size="sm"
              color="secondary"
              startContent={<PencilIcon height={16} />}
              onClick={() => handleLedgerList(user)}
            >
              Ledger
            </Button>
            <Button
              size="sm"
              color="primary"
              startContent={<PencilSquareIcon height={16} />}
              onClick={() => handleEditRetailer(user)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              color="default"
              startContent={<EyeIcon height={16} />}
            >
              View
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
          <Button
            size="md"
            color="primary"
            startContent={<PlusIcon height={18} strokeWidth={2} />}
            onClick={handleAddRetailer}
          >
            Add Retailer
          </Button>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    retailers.length,
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
    case "add-retailer":
      modalContent = (
        <AddRetailer onClose={onClose} setRetailers={setRetailers} />
      );
      break;
    case "edit-retailer":
      modalContent = (
        <EditRetailer
          selectedRetailer={selectedRetailer}
          onClose={onClose}
          setRetailers={setRetailers}
        />
      );
      break;
    case "ledger":
      modalContent = (
        <Ledger ledgers={ledgers} handleUpdateLedger={handleUpdateLedger} />
      );
      break;
    case "add-ledger":
      modalContent = (
        <AddLedger
          onClose={onClose}
          companyId={companyId}
          retailerId={retailerId}
          setLedgers={setLedgers}
          setModalType={setModalType}
        />
      );
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
        <TableBody emptyContent={"No retailers found"} items={sortedItems}>
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
        size={modalType === "ledger" ? "4xl" : "xl"}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title={
          modalType === "add-retailer"
            ? "Add New Retailer"
            : modalType === "edit-retailer"
            ? "Edit Retailer"
            : modalType === "ledger"
            ? "Ledger"
            : modalType === "add-ledger"
            ? "Update Ledger"
            : ""
        }
        content={modalContent}
        onActionButton={() => onClose()}
      />
    </div>
  );
}
