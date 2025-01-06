// import Image from "next/image";
'use client'

import { useRouter } from "next/navigation";

export default function Page() {
  const router  = useRouter();
  router.push('/auth/sign-up')
  return (  
    <div className="bg-background h-screen flex flex-col items-center justify-center">

    </div>
  );
}
