import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMySelections = (uuid, params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ['course-selections', 'my-selections', uuid],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/course-selections/my-selections/${uuid}/`, {
        params: { ...params },
      });
      
      return res.data;
    },
    ...options,
  });
};