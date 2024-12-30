import {
    Enabled,
    QueryFunction,
    QueryKey,
    useQuery,
  } from '@tanstack/react-query'
  
  export const useQueryData = (
    queryKey: QueryKey,
    queryFn: QueryFunction,
    enabled?: Enabled
  ) => {
    if(enabled) console.log("enabled",enabled)
    const { data, isPending,isLoading, isFetched, refetch, isFetching } = useQuery({
      queryKey,
      queryFn,
    })
    return { data, isPending, isFetched, refetch, isFetching,isLoading }
  }
  