import { format } from "date-fns";
import QRCode from "react-qr-code";

const ViewProduct = ({ selectedProduct }) => {
  console.log("selectedProduct", selectedProduct);
  const sellPageUrl = `http://localhost:3000/sales?product_id=${selectedProduct._id}`;
  return (
    <div className="text-center capitalize">
      <div className="flex justify-center">
        <QRCode value={sellPageUrl} />
      </div>
      <h4 className="text-lg font-semibold mb-3 mt-4">
        {selectedProduct.product_name}
        <span className="ml-1 text-primary-600">
          ({selectedProduct.quantity})
        </span>
      </h4>
      <h4 className="text-sm mb-2">
        Price:
        <span className="ml-2 font-semibold">{selectedProduct.price}</span>
      </h4>
      <h4 className="text-sm mb-2">
        Category:
        <span className="ml-2 font-semibold">
          {selectedProduct.category.category_name}
        </span>
      </h4>
      <h4 className="text-sm mb-2">
        Brand:
        <span className="ml-2 font-semibold">
          {selectedProduct.brand.brand_name}
        </span>
      </h4>
      <h4 className="text-sm mb-2">
        Retailer:
        <span className="ml-2 font-semibold">
          {selectedProduct.retailer.company_name}
        </span>
      </h4>
      <h4 className="text-sm mb-2">
        {" "}
        Created on:
        <span className="ml-2 font-semibold">
          {format(new Date(selectedProduct.createdAt), "MMMM dd, yyyy")}
        </span>
      </h4>
      {selectedProduct?.expired_date && (
        <h4 className="text-sm">
          {" "}
          Expired on:
          <span className="ml-2 font-semibold">
            {format(new Date(selectedProduct.expired_date), "MMMM dd, yyyy")}
          </span>
        </h4>
      )}
    </div>
  );
};

export default ViewProduct;
