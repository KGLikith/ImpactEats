"use client";

import { addVolunteer, getOrganisationById } from "@/actions/organisations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { useQueryData } from "@/hooks/useQueryData";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetCurrentUserTypeInfo, useGetUser } from "@/hooks/user";
import { toast } from "@/hooks/use-toast";
import { useMutationData } from "@/hooks/useMutationData";
import { useQueryClient } from "@tanstack/react-query";

type organisation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  imageUrl: string;
  description: string;
  _count: {
    volunteers: number;
    claims: number;
  };
  request: {
    id: string;
    foodType: string;
    description: string;
    name: string;
    imageUrl: string;
    requiredDate: string;
    requiredTime: string;
    quantity: number;
    quantityUnit: "WEIGHT" | "PERSON";
    createdAt: string;
  }[];
  volunteers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    imageUrl: string;
  }[];
};
type pendingClaims = {
  id: string;
  status: string;
  donationId: string;
  donation: {
    name: string;
    foodType: string;
    description: string;
    quantity: number;
    quantityUnit: "WEIGHT" | "PERSON";
    status: string;
    availableDate: string;
    availableTime: string;
    expiryDate: string;
    expiryTime: string;
  };
};

type completedClaims = {
  id: string;
  status: string;
  donationId: string;
  donation: {
    id: string;
    name: string;
    foodType: string;
    description: string;
    quantity: number;
    quantityUnit: "WEIGHT" | "PERSON";
    status: string;
  };
};

export default function OrganisationProfile() {
  const queryClient = useQueryClient();
  const { mutate } = useMutationData(
    ["add-volunteer"],
    ({ orgId, volId }: { orgId: string; volId: string }) =>
      addVolunteer(orgId, volId),
    "all-organisations",
    async (data) => {
      console.log("Volunteered", data);
      await queryClient.invalidateQueries({
        queryKey: ["organisation", data.id],
      });
      toast({
        title: "Volunteered",
        description: "You have successfully volunteered for the organization.",
        duration: 3000,
      });
    }
  );
  const { id } = useParams();
  const { userType, isLoading: userLoading } = useGetCurrentUserTypeInfo();
  const { data: organisation, isLoading } = useQueryData(
    ["organisation", id],
    () => getOrganisationById(id as string)
  );
  console.log(organisation,userType);
  if (isLoading || userLoading || !userType) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader state color="black" />
      </div>
    );
  }

  const {
    data: orgData,
    pendingClaims,
    completedClaims,
    status,
  } = organisation as {
    status: number;
    data: organisation;
    pendingClaims: pendingClaims[];
    completedClaims: completedClaims[];
  };

  if (status !== 200 || !orgData) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p>Organization not found</p>
      </div>
    );
  }

  const isDonor = userType?.type === "Donor";
  const isVolunteer = userType?.type === "Volunteer";
  const isVolunteerofOrg = orgData.volunteers.some(
    (vol) => vol.id === userType.id
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 fixed top-0 w-full z-10 border-b">
        <div className="max-w-lg  flex items-center">
          <Link href="/organisations" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-semibold">Organisation</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-20 px-4 pb-20 flex h-full">
        {/* Left Column: Profile Info */}
        <div className="w-1/3 pr-8 flex flex-col ">
          <div className="text-center mb-8">
            <Avatar className="h-20 w-20 mx-auto mb-4 bg-green-100">
              <AvatarImage src={orgData.imageUrl} alt={orgData.name} />
              <AvatarFallback className="bg-green-600 text-white text-2xl">
                {orgData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mb-4">{orgData.name}</h2>
            <p className="text-gray-600 mb-6">{orgData.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <p className="text-xl font-bold">{orgData._count.claims}</p>
                <p className="text-sm text-gray-500">Total Claims</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{orgData._count.volunteers}</p>
                <p className="text-sm text-gray-500">Total Volunteers</p>
              </div>
            </div>

            {/* Donate/Volunteer Button */}
            <div className="flex justify-center items-center gap-4 mb-8">
              {isDonor && (
                <Button
                  className="bg-orange hover:text-black hover:bg-orange w-full"
                  asChild
                >
                  <Link href={`/donate?org=${orgData.id}`}>Donate Now</Link>
                </Button>
              )}
              {isVolunteer && (
                <>
                  {isVolunteerofOrg ? (
                    <Button
                      className="mt-4 bg-green-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        toast({
                          title: "Already Volunteered",
                          description:
                            "You have already volunteered for the organization.",
                          duration: 3000,
                        });
                      }}
                    >
                      You volunteer for this organisation
                    </Button>
                  ) : (
                    <Button
                      className="mt-4 bg-green-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("click");
                        mutate({ orgId: orgData.id, volId: userType.id });
                      }}
                    >
                      Volunteer
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Contact Information */}
            <div className="text-left">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-600">{orgData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-600">{orgData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-600">{orgData.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <p className="text-gray-600">{orgData.website}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Separator orientation="vertical" />
        {/* Right Column: Tabs */}
        <div className="w-2/3 pl-8 h-full">
          <Tabs defaultValue="requests" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="claims">Claims</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            </TabsList>
            <TabsContent value="requests" className="mt-4 h-full">
              {orgData.request.length === 0 ? (
                <>
                  <div className="flex justify-center items-center h-full w-full">
                    <p>No requests found</p>
                  </div>
                </>
              ) : (
                <>
                  {orgData.request.map((req) => (
                    <div key={req.id} className="border-b py-4">
                      <p className="text-gray-600 font-semibold">{req.name}</p>
                      <p className="text-sm text-gray-500">{req.description}</p>
                    </div>
                  ))}
                </>
              )}
            </TabsContent>
            <TabsContent value="claims" className="mt-4 h-full">
              <Tabs defaultValue="pending" className="w-full h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger className="font-bold" value="pending">
                    Pending
                  </TabsTrigger>
                  <TabsTrigger className="font-bold" value="completed">
                    Completed
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="h-full">
                  {pendingClaims.length === 0 ? (
                    <>
                      <div className="flex justify-center items-center h-full w-full">
                        <p>No pending claims found</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {pendingClaims.map((claim) => (
                        <div key={claim.id} className="border-b py-4">
                          <p className="text-gray-600">{claim.donation.name}</p>
                          <p className="text-sm text-gray-500">
                            {claim.donation.description}
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                </TabsContent>
                <TabsContent value="completed" className="h-full">
                  {completedClaims.length === 0 ? (
                    <>
                      <div className="flex justify-center items-center h-full w-full">
                        <p>No completed claims yet</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {completedClaims.map((claim) => (
                        <div key={claim.id} className="border-b py-4">
                          <p className="text-gray-600">{claim.donation.name}</p>
                          <p className="text-sm text-gray-500">
                            {claim.donation.description}
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="volunteers" className="mt-4 h-full">
              {orgData.volunteers.length === 0 ? (
                <>
                  <div className="flex justify-center items-center h-full w-full">
                    <p>No volunteers yet</p>
                  </div>
                </>
              ) : (
                <>
                  {orgData.volunteers.map((vol) => (
                    <div key={vol.id} className="border-b py-4">
                      <p className="text-gray-900">{vol.name}</p>
                      <p className="text-sm text-gray-500">{vol.email}</p>
                      <p></p>
                    </div>
                  ))}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

//       {/* Main Content */}
//       <div className="max-w-lg mx-auto pt-20 px-4 pb-20">
//         <div className="text-center mb-8">
//           <Avatar className="h-20 w-20 mx-auto mb-4 bg-green-100">
//             <AvatarImage src={orgData.imageUrl} alt={orgData.name} />
//             <AvatarFallback className="bg-green-600 text-white text-2xl">
//               {orgData.name.charAt(0)}
//             </AvatarFallback>
//           </Avatar>
//           <h2 className="text-xl font-bold mb-8">{orgData.name}</h2>

//           {/* Stats */}
//           <div className="grid grid-cols-2 gap-8 mb-8">
//             <div className="text-center">
//               <p className="text-xl font-bold">{orgData._count.claims}</p>
//               <p className="text-sm text-gray-500">Total Claims</p>
//             </div>
//             <div className="text-center">
//               <p className="text-xl font-bold">{orgData._count.volunteers}</p>
//               <p className="text-sm text-gray-500">Total Volunteers</p>
//             </div>
//           </div>

//           {/* Donate Button */}
//           <div className="flex gap-4 mb-8">
//             {isDonor && (
//               <Button className="bg-orange hover:text-black hover:bg-orange w-full" asChild>
//                 <Link href={`/donate?org=${orgData.id}`}>Donate Now</Link>
//               </Button>
//             )}
//             {isVolunteer && (
//               <Button
//                 className="bg-green-500 w-full"
//                 onClick={() => console.log("Volunteer")}
//               >
//                 Volunteer
//               </Button>
//             )}
//           </div>

//           {/* Tabs */}
//           <Tabs defaultValue="about" className="w-full">
//             <TabsList className="grid w-full grid-cols-4">
//               <TabsTrigger value="about">About</TabsTrigger>
//               <TabsTrigger value="requests">Requests</TabsTrigger>
//               <TabsTrigger value="claims">Claims</TabsTrigger>
//               <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
//             </TabsList>
//             <TabsContent value="about" className="text-left mt-4">
//               <p className="text-gray-600">{orgData.description}</p>
//               <div className="grid grid-cols-2 gap-4 mt-8">
//                 <div>
//                   <p className="text-sm text-gray-500">Email</p>
//                   <p className="text-gray-600">{orgData.email}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Phone</p>
//                   <p className="text-gray-600">{orgData.phone}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Address</p>
//                   <p className="text-gray-600">{orgData.address}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Website</p>
//                   <p className="text-gray-600">{orgData.website}</p>
//                 </div>
//               </div>
//             </TabsContent>
//             <TabsContent value="requests" className="mt-4">
//               {orgData.request.map((req) => (
//                 <div key={req.id} className="border-b py-4">
//                   <p className="text-gray-600 font-semibold">{req.name}</p>
//                   <p className="text-sm text-gray-500">{req.description}</p>
//                 </div>
//               ))}
//             </TabsContent>
//             <TabsContent value="claims" className="mt-4">
//               <Tabs defaultValue="pending">
//                 <TabsList className="grid w-full grid-cols-2">
//                   <TabsTrigger className=" font-bold " value="pending">
//                     Pending
//                   </TabsTrigger>
//                   <TabsTrigger className=" font-bold" value="completed">
//                     Completed
//                   </TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="pending">
//                   {pendingClaims.map((claim) => (
//                     <div key={claim.id} className="border-b py-4">
//                       <p className="text-gray-600">{claim.donation.name}</p>
//                       <p className="text-sm text-gray-500">
//                         {claim.donation.description}
//                       </p>
//                     </div>
//                   ))}
//                 </TabsContent>
//                 <TabsContent value="completed">
//                   {completedClaims.map((claim) => (
//                     <div key={claim.id} className="border-b py-4">
//                       <p className="text-gray-600">{claim.donation.name}</p>
//                       <p className="text-sm text-gray-500">
//                         {claim.donation.description}
//                       </p>
//                     </div>
//                   ))}
//                 </TabsContent>
//               </Tabs>
//             </TabsContent>
//             <TabsContent value="volunteers" className="mt-4">
//               {orgData.volunteers.map((vol) => (
//                 <div key={vol.id} className="border-b py-4">
//                   <p className="text-gray-600">{vol.name}</p>
//                   <p className="text-sm text-gray-500">{vol.email}</p>
//                 </div>
//               ))}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// }
