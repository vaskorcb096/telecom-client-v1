import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import axiosInstance from "@/services/axiosInstance"
import { authOptions } from "../api/auth/[...nextauth]/route";
import CustomersComponent from "@/components/customers/CustomersComponent"

const Customers = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/auth/sign-in");
    }

    const response = await axiosInstance.get(`/customers/${session?.user?._id}`)

    return (
        <div className="pb-5 sm:pb-8">
            <h3 className="text-md sm:text-xl font-bold text-neutral mb-5">Customers</h3>
            <CustomersComponent customerData={response.data.payload.customers} />
        </div>
    )
}

export default Customers
