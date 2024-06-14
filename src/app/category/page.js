import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import axiosInstance from "@/services/axiosInstance"
import { authOptions } from "../api/auth/[...nextauth]/route";
import CategoryComponent from "@/components/category/CategoryComponent"

const Category = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/auth/sign-in");
    }

    const response = await axiosInstance.get(`/categories/${session?.user?._id}`)

    return (
        <div className="pb-5 sm:pb-8">
            <h3 className="text-md sm:text-xl font-bold text-neutral mb-5">Category</h3>
            <CategoryComponent categoriesData={response.data.payload.categories} />
        </div>
    )
}

export default Category
