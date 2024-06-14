import { getServerSession } from "next-auth";
import axiosInstance from "@/services/axiosInstance";
import CreateBill from "@/components/customers/CreateBill/CreateBill";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const CreateBillPage = async () => {
  const session = await getServerSession(authOptions);
  const products = await axiosInstance.get(
    `/products/${session?.user?._id}?page=1&limit=120`
  );
  // const id = route.params
  // console.log("hello prams", params);
  // const response = await axiosInstance.get(`/customers/${}`);

  return (
    <div>
      <CreateBill
        productData={products.data.payload}
        // customerData={response.data.payload}
      ></CreateBill>
    </div>
  );
};

export default CreateBillPage;
