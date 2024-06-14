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
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import ModalWrapper from "../common/modal/ModalWrapper";
import React, { useCallback, useMemo, useState } from "react";
import { SearchIcon } from "../../../public/assets/icons/SearchIcon";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";

const INITIAL_VISIBLE_COLUMNS = ["category_name", "createdAt", "actions"];

const columns = [
    { name: "CATEGORY NAME", uid: "category_name", sortable: true },
    { name: "CREATED DATE", uid: "createdAt", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function CategoryComponent({ categoriesData }) {
    const [categories, setCategories] = useState(categoriesData)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalType, setModalType] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState({});
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    const handleAddBrand = () => {
        onOpen()
        setModalType('add-category')
    }

    const handleEditCategory = (category) => {
        onOpen()
        setModalType('edit-category')
        setSelectedCategory(category)
    }

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredCategories = [...categories];

        if (hasSearchFilter) {
            filteredCategories = filteredCategories.filter((category) =>
                category.category_name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        return filteredCategories;
    }, [categories, filterValue]);

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

    const renderCell = useCallback((category, columnKey) => {
        const cellValue = category[columnKey];

        switch (columnKey) {
            case "category_name":
                return (
                    <p className="text-bold text-small capitalize">{cellValue}</p>
                );
            case "createdAt":
                return (
                    <p className="text-bold text-small capitalize">{new Date(cellValue).toLocaleDateString('en-GB').split('/').reverse().join('-')}</p>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-1">
                        <Button size="sm" color="primary" onClick={() => handleEditCategory(category)} startContent={<PencilSquareIcon height={16} />} >Edit</Button>
                        {/* <Button size="sm" color="danger" startContent={<TrashIcon height={16} />} >Delete</Button> */}
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
                    <Button size="md" color="primary" startContent={<PlusIcon height={18} strokeWidth={2} />} onClick={handleAddBrand}>Add Category</Button>
                </div>
            </div>
        );
    }, [
        filterValue,
        visibleColumns,
        onRowsPerPageChange,
        categories.length,
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
        case "add-category":
            modalContent = <AddCategory onClose={onClose} setCategories={setCategories} />;
            break;
        case "edit-category":
            modalContent = <EditCategory selectedCategory={selectedCategory} onClose={onClose} setCategories={setCategories} />;
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
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No categories found"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ModalWrapper
                size='lg'
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                title={modalType === 'add-category' ? 'Add Category' : 'Edit category'}
                content={modalContent}
                onActionButton={() => onClose()}
            />
        </div>
    );
}
