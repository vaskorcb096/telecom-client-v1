"use client";
import axiosInstance from "@/services/axiosInstance";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CreateBillProductComponents from "./CreateBillProductComponents";
import SelectedProduct from "./SelectedProduct";
import SlideOver from "./SlideOver";
import CreateBillProductComponents2 from "./CreateBillProductComponents2";

const CreateBill = ({ productData, customerData }) => {
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [products, setProducts] = useState(productData.products);
  const [quantity, setQuantity] = useState({});
  const [price, setPrice] = useState({});
  const [addItems, setAddItems] = useState([]);
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const [customerDetails, setCustomerDetails] = useState();
  const INITIAL_VISIBLE_COLUMNS = [
    "code",
    "product_name",
    "quantity",
    "price",
    "action",
  ];

  const columns = [
    { name: "CODE", uid: "code", sortable: true },
    { name: "PRODUCT NAME", uid: "product_name", sortable: true },
    { name: "IN STOCK", uid: "quantity", sortable: true },
    { name: "PRICE", uid: "price", sortable: true },
    { name: "ACTION", uid: "action" },
  ];

  const handleStockChange = (quantity) => {
    console.log('');
  };

  const handleQtyChange = (e, product) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > product.quantity) {
      toast.error("Quantity exceeds available stock.");
    } else {
      setQuantity((prevQuantity) => ({
        ...prevQuantity,
        [product._id]: newQuantity,
      }));
    }
  };

  const handlePrice = (e, product) => {
    const newPrice = parseInt(e.target.value);

    setPrice((prevPrice) => ({
      ...prevPrice,
      [product._id]: newPrice,
    }));
  };

  const handleRemoveItem = (product_id) => {
    const foundObject = productData.products.find(
      (obj) => obj._id === product_id
    );
    setAddItems((items) => [...items, product_id]);
    setSelectedProduct((prevItems) =>
      prevItems.filter((item) => item._id !== product_id)
    );

    const updatedProducts = selectedProduct.filter(
      (product) => product._id !== product_id
    );
    localStorage.setItem("product", JSON.stringify(updatedProducts));
    setProducts((prod) => [...prod, foundObject]);
  };

  const handleAddProduct = (product) => {
    // Filter out the product being added from the list of products
    const updatedProducts = products.filter((pro) => pro._id !== product._id);

    // Update the state of products
    setProducts(updatedProducts);

    // Check if the product already exists in selectedProduct
    if (!selectedProduct.find((p) => p._id === product._id)) {
      // If not, add it to selectedProduct state
      setSelectedProduct((prevSelectedProducts) => [
        ...prevSelectedProducts,
        product,
      ]);

      // Update local storage with the new selected products
      const updatedSelectedProducts = [...selectedProduct, product];
      localStorage.setItem("product", JSON.stringify(updatedSelectedProducts));
    } else {
      console.log("Product already exists!");
    }
  };

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem("product")) || [];
    const ArrayIds = localStorageData.map((item) => item._id);
    const filteredArray = productData.products.filter(
      (item) => !ArrayIds.includes(item._id)
    );
    setSelectedProduct(localStorageData);
    setProducts(filteredArray);
  }, []);

  useEffect(() => {
    const search = searchParams.get("id");

    axiosInstance
      .get(`/customers/singleCustomer/${search}`)
      .then((res) => {
        setCustomerDetails(res.data.payload.customer);

        // setBrands(res.data.payload.)
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        // setLoading(false);
      });
  }, [searchParams.get("id")]);

  return (
    <div className="grid grid-cols-12 gap-4 relative">
      <div
        className={`fixed inline-block top-[175px] text-right right-[20px] z-50 ${
          open && "hidden"
        }`}
      >
        <button onClick={() => setOpen(true)}>
          <ShoppingCartIcon className="h-10 w-10 text-" />
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white flex justify-center items-center">
            <span>{selectedProduct?.length ? selectedProduct?.length : 0}</span>
          </span>
        </button>
      </div>
      <div className="col-span-12 w-full">
        <SlideOver
          customerData={customerData}
          selectedProduct={selectedProduct}
          open={open}
          setOpen={setOpen}
          handlePrice={handlePrice}
          quantity={quantity}
          price={price}
          customerDetails={customerDetails}
        >
          <SelectedProduct
            quantity={quantity}
            price={price}
            selectedProduct={selectedProduct}
            handlePrice={handlePrice}
            handleQtyChange={handleQtyChange}
            handleRemoveItem={handleRemoveItem}
          />
        </SlideOver>
        <CreateBillProductComponents2
          productData={productData}
          products={products}
          handleAddProduct={handleAddProduct}
          addItems={addItems}
          columns={columns}
          INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
          cmp="create-bill"
          handleStockChange={handleStockChange}
          handleQtyChange={handleQtyChange}
        />
      </div>
    </div>
  );
};

export default CreateBill;
