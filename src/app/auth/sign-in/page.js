"use client";
import SignInComponent from "@/components/auth/SignInComponent";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const SignIn = () => {
  const session = useSession();
  if (session?.data?.user) {
    redirect("/");
  }
  return (
    <div className="pb-5 sm:pb-8">
      <SignInComponent />
    </div>
  );
};

export default SignIn;
