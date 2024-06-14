'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination
} from '@nextui-org/react'
import React, { useCallback, useMemo, useState } from 'react'
import { SearchIcon } from '../../../public/assets/icons/SearchIcon'

const INITIAL_VISIBLE_COLUMNS = [
  'invoiceNo',
  'product.product_name',
  'quantity',
  'price',
  'total_price',
  'createdAt'
]

const columns = [
  {
    name: 'Invoice No',
    uid: 'invoiceNo',
    sortable: true
  },
  { name: 'Product Info', uid: 'product.product_name', sortable: true },
  { name: 'Quantity', uid: 'quantity', sortable: true },
  { name: 'Price', uid: 'price', sortable: true },
  { name: 'Total Price', uid: 'total_price', sortable: true },
  { name: 'Created date', uid: 'createdAt', sortable: true }
]

export default function ReturnProductComponent ({ returnProducts }) {
  const [filterValue, setFilterValue] = useState('')
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [rowsPerPage, setRowsPerPage] = useState(8)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'invoiceNo',
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
    let filteredReturnProducts = [...returnProducts]

    if (hasSearchFilter) {
      filteredReturnProducts = filteredReturnProducts.filter(returnProduct =>
        returnProduct.product.product_name
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      )
    }

    return filteredReturnProducts
  }, [returnProducts, filterValue])

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

  const renderCell = useCallback((returnProduct, columnKey) => {
    const cellValue = returnProduct[columnKey]

    switch (columnKey) {
      case 'invoiceNo':
        return (
          <p className='font-bold text-small capitalize'>#IN-{cellValue}</p>
        )
      case 'product.product_name':
        return (
          <p className='text-bold text-small capitalize'>
            {returnProduct.product.product_name}
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
            placeholder='Search by product...'
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
    returnProducts.length,
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
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'No return product found'} items={sortedItems}>
          {item => (
            <TableRow key={item._id}>
              {columnKey => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
