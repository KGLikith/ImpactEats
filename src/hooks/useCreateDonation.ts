import {
  DefaultOptions,
  DonationFormData,
  donationSchema,
} from "@/schemas/donation-form.schema";
import { useMutationData } from "./useMutationData";
import { createDonation } from "@/actions/donation";
import useZodForm from "./useZodForm";
import { toast } from "./use-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateDonationHook = (defaultData?: DefaultOptions) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutationData(
    ["create-donation"],
    (data: DonationFormData) => createDonation(data),
    "allDonations",
    async(data) => {
      if (data.status === 200) {
        toast({
          title: "Donation Created",
          description: "Your donation has been created successfully",
          duration: 2000,
        });
        router.push(`/donation/${data.data.id}`);
        await queryClient.invalidateQueries({
          queryKey: ["user-history"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["user-notifications"],
        });
        console.log("helloh")
      }
    },
    (error) => {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred while creating donation",
        duration: 2000,
      });
    }
  );

  const { form, onFormSubmit } = useZodForm(
    donationSchema,
    mutate,
    defaultData
  );
  return { form, onFormSubmit, isPending };
};
