import useAxiosPrivate from "@/hooks/axios/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";

export const useReadInternalTransferReviews = (params = {}, options = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['internal-transfer-reviews', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/internal-transfer-reviews/', { params });
      return res.data;
    },
    ...options,
  });
};