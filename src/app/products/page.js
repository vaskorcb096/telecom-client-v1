import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import axiosInstance from "@/services/axiosInstance";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ProductsComponent from "@/components/products/ProductsComponent";

const Products = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const brands = await axiosInstance.get(`/brands/${session?.user?._id}`);
  const retailers = await axiosInstance.get(`/retailers/${session?.user?._id}`);
  const categories = await axiosInstance.get(
    `/categories/${session?.user?._id}`
  );
  const products = await axiosInstance.get(
    `/products/${session?.user?._id}?page=1&limit=8&role=${session?.user?.role}`
  );

  const INITIAL_VISIBLE_COLUMNS = [
    "product_name",
    "category.category_name",
    "brand.brand_name",
    "price",
    "quantity",
    "retailer.retailer_name",
    "memo_ref",
    "expired_date",
    "actions",
  ];

  const columns = [
    { name: "PRODUCT NAME", uid: "product_name", sortable: true },
    { name: "CATEGORY", uid: "category.category_name", sortable: true },
    { name: "BRAND", uid: "brand.brand_name", sortable: true },
    { name: "PRICE", uid: "price", sortable: true },
    { name: "QUANTITY", uid: "quantity", sortable: true },
    { name: "RETAILER", uid: "retailer.retailer_name", sortable: true },
    { name: "MEMO NO", uid: "memo_ref", sortable: true },
    { name: "EXPIRE ON", uid: "expired_date", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  return (
    <div className="pb-5 sm:pb-8">
      <h3 className="text-md sm:text-xl font-bold text-neutral mb-5">
        Products
      </h3>
      <ProductsComponent
        INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
        columns={columns}
        productData={products.data.payload}
        categories={categories.data.payload.categories}
        brands={brands.data.payload.brands}
        retailers={retailers.data.payload.retailers}
        companyId={session?.user?._id}
        role={session?.user?.role}
      />
    </div>
  );
};

export default Products;
