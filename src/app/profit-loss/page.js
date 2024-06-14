import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import axiosInstance from "@/services/axiosInstance";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DueListComponent from "@/components/due-list/DueListComponent";
import SalesComponent from "@/components/all-sales/SalesComponent";

const ProfitOrLoss = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/sign-in");
  }
  const sales = await axiosInstance.get(
    `/sales/${session?.user?._id}?page=1&limit=8&role=${session?.user?.role}`
  );

  return (
    <div className="pb-5 sm:pb-8">
      <h3 className="text-md sm:text-xl font-bold text-neutral mb-5">
        Profit/Loss List
      </h3>
      <SalesComponent
        cmp={"profit-loss"}
        role={session?.user?.role}
        companyId={session?.user?._id}
        salesData={sales.data.payload}
      />
    </div>
  );
};

export default ProfitOrLoss;
