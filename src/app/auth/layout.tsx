import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
// import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const user = await currentUser();
  // console.log(user)
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="h-screen flex w-full justify-center bg-neutral-900">
      <div className="w-[600px] ld:w-full  flex flex-col items-start p-6">
        {/* <Image
          src="/images/donaiton-page.png"
          alt="Impact Eats Logo"
          sizes="100vw"
          style={{
            width: "20%",
            height: "auto",
          }}
          width={0}
          height={0}
        /> */}
        <h1 className="font-extrabold text-2xl text-green-600">ImpactEats</h1>
        {children}
      </div>
      <div className="hidden lg:flex flex-1 w-full max-h-full bg-green-50 max-w-4000px overflow-hidden relative  flex-col pt-10 pl-24 gap-3">
        <h2 className="text-green-800 md:text-4xl font-bold">
          Welcome to Impact Eats: Fighting Hunger Together
        </h2>
        <p className="text-green-700 md:text-sm mb-10">
          Join us in our mission to connect communities through food donations.
          Empower those in need and help reduce food waste. Together, we can
          make a difference!
        </p>
        <div className="flex justify-center items-center w-full h-full">

        <Image
          src="/images/donaiton-page.jpg"
          alt="Donation app interface"
          loading="lazy"
          sizes="30"
          className="absolute shrink-0 w-[70%] h-[70%] top-56"
          width={0}
          height={0}
        />
        </div>
      </div>
    </div>
  );
};

export default Layout;
