import React, { useCallback, useMemo, useState } from 'react'
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline'
import { SearchIcon } from '../../../public/assets/icons/SearchIcon'
import { Button, Input, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'

const INITIAL_VISIBLE_COLUMNS = [
    'payment_type',
    'amount',
    'createdAt',
    'actions'
]

const columns = [
    { name: 'PAYMENT TYPE', uid: 'payment_type', sortable: true },
    { name: 'AMOUNT', uid: 'amount', sortable: true },
    { name: 'CREATED DATE', uid: 'createdAt', sortable: true },
    { name: 'ACTIONS', uid: 'actions' }
]

const Ledger = ({ ledgers, handleUpdateLedger }) => {
    const [rowsPerPage, setRowsPerPage] = useState(8)
    const [filterValue, setFilterValue] = useState('')
    const [selectedKeys, setSelectedKeys] = useState(new Set([]))
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    )
    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'age',
        direction: 'ascending'
    })
    const [page, setPage] = useState(1)

    const hasSearchFilter = Boolean(filterValue)

    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns

        return columns.filter(column =>
            Array.from(visibleColumns).includes(column.uid)
        )
    }, [visibleColumns])

    const filteredItems = useMemo(() => {
        let filteredLedgers = [...ledgers]

        if (hasSearchFilter) {
            filteredLedgers = filteredLedgers.filter(ledger =>
                ledger.payment_type.toLowerCase().includes(filterValue.toLowerCase()) || ledger.amount.toLowerCase().includes(filterValue.toLowerCase()) || ledger.createdAt.toLowerCase().includes(filterValue.toLowerCase())
            )
        }

        return filteredLedgers
    }, [ledgers, filterValue])

    const pages = Math.ceil(filteredItems.length / rowsPerPage)

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return filteredItems.slice(start, end)
    }, [page, filteredItems, rowsPerPage])

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0

            return sortDescriptor.direction === 'descending' ? -cmp : cmp
        })
    }, [sortDescriptor, items])

    const renderCell = useCallback((ledger, columnKey) => {
        const cellValue = ledger[columnKey]

        switch (columnKey) {
            case 'payment_type':
                return (
                    <p className='text-bold text-small capitalize whitespace-nowrap'>
                        {cellValue}
                    </p>
                )
            case 'amount':
                return (
                    <p className='text-bold text-small capitalize whitespace-nowrap'>
                        {cellValue}
                    </p>
                )
            case 'createdAt':
                return (
                    <p className='text-bold text-small capitalize'>
                        {new Date(cellValue)
                            .toLocaleDateString('en-GB')
                            .split('/')
                            .reverse()
                            .join('-')}
                    </p>
                )
            case 'actions':
                return (
                    <div>
                        <Button
                            size='sm'
                            color='default'
                            startContent={<EyeIcon height={16} />}
                        >
                            View
                        </Button>
                    </div>
                )
            default:
                return cellValue
        }
    }, [])

    const onRowsPerPageChange = useCallback(e => {
        setRowsPerPage(Number(e.target.value))
        setPage(1)
    }, [])

    const onSearchChange = useCallback(value => {
        if (value) {
            setFilterValue(value)
            setPage(1)
        } else {
            setFilterValue('')
        }
    }, [])

    const onClear = useCallback(() => {
        setFilterValue('')
        setPage(1)
    }, [])

    const topContent = useMemo(() => {
        return (
            <div className='flex flex-col gap-4'>
                <div className='flex justify-between gap-3 items-center'>
                    <Input
                        size='sm'
                        isClearable
                        className='w-full sm:max-w-[44%]'
                        placeholder='Search'
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <Button
                        size='md'
                        color='primary'
                        startContent={<PlusIcon height={18} strokeWidth={2} />}
                        onClick={handleUpdateLedger}
                    >
                        Add Ledger
                    </Button>
                </div>
            </div>
        )
    }, [
        filterValue,
        visibleColumns,
        onRowsPerPageChange,
        ledgers.length,
        onSearchChange,
        hasSearchFilter
    ])

    const bottomContent = useMemo(() => {
        return (
            <div className='flex w-full justify-center'>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color='primary'
                    page={page}
                    total={pages}
                    onChange={page => setPage(page)}
                />
            </div>
        )
    }, [selectedKeys, items.length, page, pages, hasSearchFilter])

    return (
        <Table
            isStriped
            aria-label='Example table with custom cells, pagination and sorting'
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement='outside'
            classNames={{
                wrapper: 'max-h-[600px]'
            }}
            selectedKeys={selectedKeys}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement='outside'
            onSortChange={setSortDescriptor}
            showSelectionCheckboxes={false}
        >
            <TableHeader columns={headerColumns}>
                {column => (
                    <TableColumn key={column.uid} allowsSorting={column.sortable}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={'No ledgers found'} items={sortedItems}>
                {item => (
                    <TableRow key={item._id}>
                        {columnKey => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default Ledger