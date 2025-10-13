import { useInfiniteQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadInfiniteUsers = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery({
    queryKey: ['users-infinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosPrivate.get('/api/v1/users/', { 
        params: {
          ...params,
          page: pageParam,
        },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return url.searchParams.get('page');
      }
      return undefined;
    },
  });
};
