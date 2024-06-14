import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import axiosInstance from "@/services/axiosInstance";
import { authOptions } from "../api/auth/[...nextauth]/route";
import CompanyComponent from "@/components/companies/CompanyComponent";

const Companies = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/sign-in");
  }
  if (session?.user.role !== "superAdmin") {
    redirect("/");
  }
  const response = await axiosInstance.get("/users");

  return (
    <div className="pb-5 sm:pb-8">
      <h3 className="text-md sm:text-xl font-bold text-neutral mb-5">
        Companies
      </h3>
      <CompanyComponent CompanyData={response.data.payload.users} />
    </div>
  );
};

export default Companies;
