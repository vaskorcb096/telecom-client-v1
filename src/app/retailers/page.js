import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import axiosInstance from "@/services/axiosInstance";
import { authOptions } from "../api/auth/[...nextauth]/route";
import RetailersComponent from "@/components/retailers/RetailersComponent";

const Retailers = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const response = await axiosInstance.get(
    `/retailers/${session?.user?._id}?page=1&limit=8&role=${session?.user?.role}`
  );

  return (
    <div className="pb-5 sm:pb-8">
      <h3 className="text-md sm:text-xl font-bold text-neutral mb-5">
        Retailers
      </h3>
      <RetailersComponent
        retailerData={response.data.payload.retailers}
        role={session?.user?.role}
      />
    </div>
  );
};

export default Retailers;
