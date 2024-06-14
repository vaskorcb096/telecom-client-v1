"use client";

import SlideOver from "./SlideOver";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import SelectedProduct from "./SelectedProduct";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import CreateBillProductComponents2 from "./CreateBillProductComponents2";

const Sales = ({ productData, customers }) => {
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [products, setProducts] = useState(productData.products);
  const [quantity, setQuantity] = useState({});
  const [price, setPrice] = useState({});
  const searchParams = useSearchParams();
  const [customerDetails, setCustomerDetails] = useState();

  const handleQtyChange = (e, product) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity <= 0 || !typeof newQuantity === "number") {
      toast.error("Please type valid quantity");
    }

    if (newQuantity > product.quantity) {
      toast.error("Quantity exceeds available stock.");
    } else if (newQuantity >= 1 && newQuantity <= product.quantity) {
      // const remainingQuantity = product.quantity - newQuantity;
      console.log("productData.products", productData.products);
      const updatedProducts = products.map((p, index) =>
        p._id === product._id
          ? {
              ...p,
              quantity: productData.products[index].quantity - newQuantity,
              newQuantity: newQuantity,
              disabled: true,
            }
          : p
      );

      const existingProducts =
        JSON.parse(localStorage.getItem("product")) || [];

      const updatedLocalStorageProducts = existingProducts.map((p) =>
        p._id === product._id
          ? {
              ...p,
              quantity: p.quantity - newQuantity,
              newQuantity: newQuantity,
              disabled: true,
            }
          : p
      );

      localStorage.setItem(
        "product",
        JSON.stringify(updatedLocalStorageProducts)
      );

      setProducts(updatedProducts);

      setQuantity((prevQuantity) => ({
        ...prevQuantity,
        [product._id]: newQuantity,
      }));
    }
  };

  const handlePrice = (e, product) => {
    const newPrice = parseInt(e.target.value);

    const existingProducts = JSON.parse(localStorage.getItem("product")) || [];

    const updatedLocalStorageProducts = existingProducts.map((p) =>
      p._id === product._id
        ? {
            ...p,

            unitPrice: newPrice,
          }
        : p
    );

    localStorage.setItem(
      "product",
      JSON.stringify(updatedLocalStorageProducts)
    );

    setPrice((prevPrice) => ({
      ...prevPrice,
      [product._id]: newPrice,
    }));
  };

  const handleRemoveItem = (product_id) => {
    const updatedProducts = products.map((p, index) =>
      p._id === product_id
        ? {
            ...p,
            quantity: productData.products[index].quantity,
            newQuantity: 0,
            disabled: false,
          }
        : p
    );

    setProducts(updatedProducts);

    if (!products || products.length === 0) {
      console.log("Products array is empty or undefined");
      return;
    }

    const foundObject = products.find((obj) => obj._id === product_id);

    setSelectedProduct((prevItems) =>
      prevItems.filter((item) => item._id !== product_id)
    );

    const updatedProduct = selectedProduct.filter(
      (product) => product._id !== product_id
    );
    localStorage.setItem("product", JSON.stringify(updatedProduct));

    if (foundObject) {
      setProducts((prod) => [...prod, foundObject]);
    } else {
      console.log("Product not found in products array");
    }
  };

  const handleAddProduct = (product) => {
    const localStorageProducts =
      JSON.parse(localStorage.getItem("product")) || [];
    const productIndexForLocal = localStorageProducts.findIndex(
      (pro) => pro._id === product._id
    );

    console.log("localStorageProducts", localStorageProducts);
    if (productIndexForLocal !== -1) {
      return;
    }

    // Merge localStorage data into products array
    const updatedProducts = products.map((pro) => {
      const localProduct = localStorageProducts.find((p) => p._id === pro._id);
      if (localProduct) {
        return {
          ...pro,
          quantity: pro.quantity - localProduct.newQuantity,
          disabled: localProduct.quantity <= 0,
        };
      }
      return pro;
    });
    const productIndex = updatedProducts.findIndex(
      (pro) => pro._id === product._id
    );
    const updatedProductsNew = [...updatedProducts];
    updatedProductsNew[productIndex] = {
      ...updatedProductsNew[productIndex],
      quantity: updatedProductsNew[productIndex].quantity - 1,
      disabled: true,
      newQuantity: 1,
    };

    const filteredProducts = updatedProductsNew.filter(
      (pro) => pro.quantity > 0
    );

    setProducts(filteredProducts);
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [product._id]: 1,
    }));

    if (!selectedProduct.find((p) => p._id === product._id)) {
      setSelectedProduct((prevSelectedProducts) => [
        ...prevSelectedProducts,
        product,
      ]);

      const updatedSelectedProducts = [
        ...localStorageProducts,
        { ...product, quantity: product.quantity - 1, newQuantity: 1 },
      ];
      setSelectedProduct(updatedSelectedProducts);
      localStorage.setItem("product", JSON.stringify(updatedSelectedProducts));
    } else {
      console.log("Product already exists!");
    }
  };

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem("product")) || [];
    setSelectedProduct(localStorageData);
    console.log(localStorageData, "productData", productData);
    const updatedProducts = productData.products.map((product) => {
      const localStorageProduct = localStorageData.find(
        (p) => p._id === product._id
      );
      console.log(
        localStorageProduct,
        "localStorageProduct product.quantity,product.quantity",
        product
      );
      let existingQuantity = {},
        existingPrice = {};
      localStorageData.map((item) => {
        existingQuantity[item._id] = item.newQuantity;
        existingPrice[item._id] = item.unitPrice;
      });

      setQuantity(existingQuantity);
      setPrice(existingPrice);

      if (localStorageProduct?.quantity) {
        let disabled = !!localStorageProduct;
        const quantity = localStorageProduct
          ? product.quantity - localStorageProduct.newQuantity
          : product.quantity;

        return { ...product, quantity, disabled };
      } else {
        return { ...product, quantity: product.quantity, disabled: false };
      }
    });

    console.log("updatedProducts updatedProducts", updatedProducts);

    setProducts(updatedProducts);
  }, [productData]);

  useEffect(() => {
    const search = searchParams.get("id");

    axiosInstance
      .get(`/customers/singleCustomer/${search}`)
      .then((res) => {
        setCustomerDetails(res.data.payload.customer);
      })
      .catch((err) => {
        // toast.error(err.response.data.message);
      })
      .finally(() => {});
  }, [searchParams.get("id")]);
  console.log("here is quantity", quantity);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-6 w-full">
        <SlideOver
          selectedProduct={selectedProduct}
          handlePrice={handlePrice}
          quantity={quantity}
          price={price}
          customers={customers}
          customerDetails={customerDetails}
          setSelectedProduct={setSelectedProduct}
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
      </div>
      <div className="col-span-12 lg:col-span-6 w-full">
        <CreateBillProductComponents2
          products={products}
          handleAddProduct={handleAddProduct}
        />
      </div>
    </div>
  );
};

export default Sales;
