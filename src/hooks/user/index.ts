import { useQuery } from "@tanstack/react-query";

export const useGetUser = () => {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/user");
        const { user } = await response.json();
        return user;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  });
  return { ...query, user: query.data };
};

export const useGetUserTypeInfo = (id: string,type: string) => {
  const query = useQuery({
    queryKey: ["currentUserType",id],
    queryFn: async () => {
      try {
        if(!id || !type) return null;
        const response = await fetch(`/api/user/type?id=${id}&type=${type}`,{
          method: "GET",
        });
        const { userType } = await response.json();
        return userType;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  });
  return { ...query, userType: query.data };
}