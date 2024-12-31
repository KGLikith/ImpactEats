import {
  MutationFunction,
  MutationKey,
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";

export const useMutationData = (
  mutationKey: MutationKey,
  mutationFn: MutationFunction<any, any>,
  queryKey?: string,
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey,
    mutationFn,
    // onMutate: async (variables) => {
    //   onSuccess && onSuccess(variables);
    //   return variables;
    // },
    onSuccess: async(data) => {
      console.log("Mutation Data:", data);
      if(onSuccess)
        onSuccess(data);
      return data;
    },
    onError:(error)=>{
      if(onError)
        onError(error);
      return error;
    },
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: [queryKey],
        exact: true,
      });
    },
  });

  return { mutate, isPending };
};

export const useMutationDataState = (mutationKey: MutationKey) => {
  const data = useMutationState({
    filters: { mutationKey },
    select: (mutation) => {
      return {
        variables: mutation.state.variables as any,
        status: mutation.state.status,
      };
    },
  });

  const latestVariables = data[data.length - 1];
  return { latestVariables };
};
