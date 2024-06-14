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
  useDisclosure,
  Spinner
} from '@nextui-org/react'
import AddProduct from './AddProduct'
import EditProduct from './EditProduct'
import axiosInstance from '@/services/axiosInstance'
import ModalWrapper from '../common/modal/ModalWrapper'
import React, { useCallback, useMemo, useState } from 'react'
import { SearchIcon } from '../../../public/assets/icons/SearchIcon'
import {
  EyeIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import ViewProduct from './ViewProduct'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function ProductsComponent({
  productData,
  categories,
  brands,
  retailers,
  INITIAL_VISIBLE_COLUMNS,
  columns,
  companyId,
  role,
  type
}) {
  const pathname = usePathname()

  const stockAlertData = productData.products?.filter(
    product => product.quantity <= product.stock_out_alert
  )

  const [products, setProducts] = useState(
    type === 'stock-alert' ? stockAlertData : productData.products
  )
  const [selectedProduct, setSelectedProduct] = useState({})
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalType, setModalType] = useState('')
  const [filterValue, setFilterValue] = useState('')

  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )

  const { totalPages, currentPage } = productData.pagination
  const session = useSession()

  const handlePageChange = async newPage => {
    setLoading(true)
    axiosInstance
      .get(`/products/${companyId}?page=${newPage}&limit=8&role=${role}`)
      .then(res => {
        setLoading(false)
        setProducts(res.data.payload.products)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleAddProductModal = () => {
    onOpen()
    setModalType('add-product')
  }

  const handleEditProduct = product => {
    onOpen()
    setModalType('edit-product')
    setSelectedProduct(product)
  }

  const handleViewProduct = product => {
    onOpen()
    setModalType('view-product')
    setSelectedProduct(product)
  }

  const productArray = []

  const handleAddProduct = product => {
    if (!productArray.find(p => p._id === product._id)) {
      setSelectedProduct(allProduct => [...allProduct, product])
    } else {
      console.log('Product already exists!')
    }
    productArray.push(product)
  }

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter(column =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey]

    switch (columnKey) {
      case 'product_name':
        return (
          <p className='text-bold text-small capitalize whitespace-nowrap'>
            {cellValue}
          </p>
        )
      case 'category.category_name':
        return (
          <p className='text-bold text-small capitalize whitespace-nowrap'>
            {product.category.category_name}
          </p>
        )
      case 'brand.brand_name':
        return (
          <p className='text-bold text-small capitalize whitespace-nowrap'>
            {product.brand.brand_name}
          </p>
        )
      case 'price':
        return (
          <p className='text-bold text-small capitalize whitespace-nowrap'>
            {cellValue}
          </p>
        )
      case 'quantity':
        return (
          <p
            className={`text-bold text-small capitalize whitespace-nowrap ${type === 'stock-alert' &&
              product.quantity <= product.stock_out_alert &&
              'text-danger'
              }`}
          >
            {cellValue}
          </p>
        )
      case 'retailer.retailer_name':
        return (
          <p className='text-bold text-small capitalize whitespace-nowrap'>
            {product.retailer.retailer_name}
          </p>
        )
      case 'expired_date':
        return (
          <p className='text-bold text-small capitalize whitespace-nowrap'>
            {new Date(cellValue)
              .toLocaleDateString('en-GB')
              .split('/')
              .reverse()
              .join('-')}
          </p>
        )
      case 'actions':
        return (
          <div className='relative flex items-center gap-1'>
            <Button
              isIconOnly
              size='sm'
              radius='sm'
              color='default'
              aria-label='Like'
              onClick={() => handleViewProduct(product)}
            >
              <EyeIcon height={16} />
            </Button>
            <Button
              isIconOnly
              size='sm'
              radius='sm'
              color='primary'
              aria-label='Like'
              onClick={() => handleEditProduct(product)}
            >
              <PencilSquareIcon height={16} />
            </Button>
            <Button
              isIconOnly
              size='sm'
              radius='sm'
              color='danger'
              aria-label='Like'
            >
              <TrashIcon height={16} />
            </Button>
          </div>
        )
      case 'action':
        return (
          <Button
            isIconOnly
            size='sm'
            radius='sm'
            color='secondary'
            aria-label='Like'
            onClick={() => handleAddProduct(product)}
          >
            <PlusCircleIcon height={22} />
          </Button>
        )
      default:
        return cellValue
    }
  }, [])

  const onSearchChange = useCallback(value => {
    if (value) {
      setFilterValue(value)
      setLoading(true)
      axiosInstance
        .get(
          `/products/${companyId}?page=1&limit=8&search=${value}&role=${role}`
        )
        .then(res => {
          setLoading(false)
          setProducts(res.data.payload.products)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
    axiosInstance
      .get(
        `/products/${companyId}?page=1&limit=8&search=${filterValue}&role=${role}`
      )
      .then(res => {
        setLoading(false)
        setProducts(res.data.payload.products)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-center'>
          <Input
            size='sm'
            isClearable
            className='w-full sm:max-w-[44%]'
            placeholder='Search by ref no...'
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          {type !== 'stock-alert' && (
            <Button
              size='md'
              color='primary'
              startContent={<PlusIcon height={18} strokeWidth={2} />}
              onClick={handleAddProductModal}
            >
              Add Product
            </Button>
          )}
        </div>
      </div>
    )
  }, [filterValue, visibleColumns, products.length, hasSearchFilter])

  const bottomContent = useMemo(() => {
    return (
      <div className='flex w-full justify-center'>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={currentPage}
          total={totalPages}
          onChange={handlePageChange}
        />
      </div>
    )
  }, [totalPages, currentPage])

  let modalContent = null

  switch (modalType) {
    case 'add-product':
      modalContent = (
        <AddProduct
          onClose={onClose}
          setProducts={setProducts}
          categories={categories}
          brands={brands}
          retailers={retailers}
        />
      )
      break
    case 'edit-product':
      modalContent = (
        <EditProduct
          selectedProduct={selectedProduct}
          onClose={onClose}
          setProducts={setProducts}
          categories={categories}
          brands={brands}
          retailers={retailers}
        />
      )
      break
    case 'view-product':
      modalContent = (
        <ViewProduct selectedProduct={selectedProduct} onClose={onClose} />
      )
      break
    default:
      modalContent = null
      break
  }

  return (
    <div>
      <Table
        isStriped
        aria-label='Example table with custom cells, pagination and sorting'
        isHeaderSticky
        bottomContent={type !== 'stock-alert' && bottomContent}
        bottomContentPlacement='outside'
        classNames={{
          wrapper: 'max-h-[600px]'
        }}
        topContent={topContent}
        topContentPlacement='outside'
        showSelectionCheckboxes={false}
      >
        <TableHeader columns={headerColumns}>
          {column => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={'No products found'}
          items={products}
          loadingContent={<Spinner />}
          isLoading={loading}
        >
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
        size={modalType === 'view-product' ? 'xl' : '4xl'}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title={
          modalType === 'add-product'
            ? 'Add New Product'
            : modalType === 'view-product'
              ? ' Product Information'
              : 'Edit Product'
        }
        content={modalContent}
        onActionButton={() => onClose()}
      />
    </div>
  )
}
