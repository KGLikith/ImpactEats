import {
  DefaultOptions,
  DonationFormData,
  donationSchema,
} from "@/schemas/donation-form.schema";
import { useMutationData } from "./useMutationData";
import { createDonation } from "@/actions/donation";
import useZodForm from "./useZodForm";
import { toast } from "./use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useDonationContextHook } from "@/context/user-donation";

export const useCreateDonationHook = (defaultData?: DefaultOptions) => {
  // const router = useRouter();
  const queryClient = useQueryClient();
  const { currentStep, setCurrentStep,setDonationId } = useDonationContextHook();
  const { mutate, isPending } = useMutationData(
    ["create-donation"],
    (data: DonationFormData) => createDonation(data),
    "allDonations",
    async (data) => {
      // console.log("data",data)
      if (data.status === 200) {
        toast({
          title: "Donation Created",
          description: "Your donation has been created successfully",
          duration: 2000,
        });
        setDonationId(data.data.id);
        setCurrentStep(currentStep + 1);
        await queryClient.invalidateQueries({
          queryKey: ["user-history"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["user-notifications"],
        });
      }
    },
    (error) => {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred while creating donation. Please try again later",
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
