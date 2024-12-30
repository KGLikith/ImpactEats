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

export const useGetCurrentUserTypeInfo = () => {
  const query = useQuery({
    queryKey: ["currentUserTypeInfo"],
    queryFn: async () => {
      try {
        const result = await fetch(`/api/user`);
        const { user } = await result.json();
        if (!user) return null;
        // console.log(user)
        const userTypeResult = await fetch(
          `/api/user/type?id=${user.id}&type=${user.type}`
        );
        const { userType, type } = await userTypeResult.json();

        // console.log("userType", userType);
        return { ...userType, type };
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  });
  return { ...query, userType: query.data };
};

export const useGetUserTypeInfo = (id: string, type: string) => {
  const query = useQuery({
    queryKey: ["UserTypeInfo", id],
    queryFn: async () => {
      try {
        if (!id || !type) return null;
        const response = await fetch(`/api/user/type?id=${id}&type=${type}`, {
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
};
