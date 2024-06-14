'use client'

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
  useDisclosure
} from '@nextui-org/react'
import DuePayment from './DuePayment'
import ModalWrapper from '../common/modal/ModalWrapper'
import React, { useCallback, useMemo, useState } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { SearchIcon } from '../../../public/assets/icons/SearchIcon'

const INITIAL_VISIBLE_COLUMNS = [
  'customer_name',
  'phone',
  'shop_name',
  'dueAmount',
  'address',
  'actions'
]

const columns = [
  { name: 'NAME', uid: 'customer_name', sortable: true },
  { name: 'PHONE', uid: 'phone', sortable: true },
  { name: 'SHOP NAME', uid: 'shop_name', sortable: true },
  { name: 'DUE AMOUNT', uid: 'dueAmount', sortable: true },
  { name: 'ADDRESS', uid: 'address', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
]

export default function CustomersDueList({ customerData }) {
  const [customers, setCustomers] = useState(customerData)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [rowsPerPage, setRowsPerPage] = useState(8)
  const [filterValue, setFilterValue] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState({})
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'age',
    direction: 'ascending'
  })
  const [page, setPage] = useState(1)

  const handleCreatePayment = user => {
    onOpen()
    setSelectedCustomer(user)
  }

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter(column =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredUsers = [...customers]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    return filteredUsers
  }, [customers, filterValue])

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

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'customer_name':
        return (
          <p className='text-bold text-small capitalize whitespace-nowrap'>
            {cellValue}
          </p>
        )
      case 'phone':
        return (
          <p className='text-bold text-small capitalize whitespace-nowrap'>
            {cellValue}
          </p>
        )
      case 'email':
        return (
          <p className='text-bold text-small capitalize whitespace-nowrap'>
            {cellValue}
          </p>
        )
      case 'shop_name':
        return (
          <p className='text-bold text-small capitalize whitespace-nowrap'>
            {cellValue}
          </p>
        )
      case 'address':
        return (
          <p className='text-bold text-small capitalize whitespace-nowrap'>
            {cellValue}
          </p>
        )
      case 'actions':
        return (
          <div className='relative flex items-center gap-1'>
            <Button
              size='sm'
              color='secondary'
              endContent={<ChevronRightIcon height={16} strokeWidth={2} />}
              onClick={() => handleCreatePayment(user)}
            >
              Collect Due
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
            placeholder='Search by name...'
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    )
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    customers.length,
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
    <div>
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
        <TableBody emptyContent={'No users found'} items={sortedItems}>
          {item => (
            <TableRow key={item._id}>
              {columnKey => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ModalWrapper
        size='xl'
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title="Create Payment"
        content={
          <DuePayment
            onClose={onClose}
            setCustomers={setCustomers}
            selectedCustomer={selectedCustomer}
          />
        }
        onActionButton={() => onClose()}
      />
    </div>
  )
}
