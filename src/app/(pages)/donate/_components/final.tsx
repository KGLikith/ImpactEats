import { Button } from "@/components/ui/button";
import { useDonationContextHook } from "@/context/user-donation";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
    const {DonationId} = useDonationContextHook()
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <CheckCircleIcon className="h-16 w-16 text-green-500" />
      <h1 className="text-3xl font-bold mt-4">Thank You for Your Donation!</h1>
      <p className="text-lg text-gray-600 mt-2 text-center">
        Your donation will help those in need. We appreciate your generosity!
      </p>
      <div className="flex gap-4 mt-6">
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button
          asChild
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          <Link href={`/donations/${DonationId}`}>View Donation Info</Link>
        </Button>
      </div>
    </div>
  );
}
