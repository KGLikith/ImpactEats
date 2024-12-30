import { UseMutateFunction } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z, { ZodSchema } from "zod";

const useZodForm = (
  schema: ZodSchema,
  mutation: UseMutateFunction,
  defaultValues?: any
) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
    mode: "onChange",
  });

  const onFormSubmit = form.handleSubmit(
    async (values: z.infer<typeof schema>) => {
      form.clearErrors();
      form.reset();
      mutation({ ...values });
    }
  );

  return { form, onFormSubmit };
};
export default useZodForm;
