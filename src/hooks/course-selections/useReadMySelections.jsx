import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMySelections = (params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ['course-selections', 'my-selections'],
    queryFn: async () => {
      const res = await axiosPrivate.get("/api/v1/course-selections/my-selections/", {
        params: { ...params },
      });
      
      return res.data;
    },
    ...options,
  });
};