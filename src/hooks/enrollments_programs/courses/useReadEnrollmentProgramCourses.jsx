import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useReadEnrollmentProgramCourses = (initialParams = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery({
    queryKey: ['enrollment-program-courses', initialParams],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosPrivate.get('/api/v1/enrollment-program-courses/', {
        params: { ...initialParams, page: pageParam },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return url.searchParams.get('page');
      }
      return undefined;
    }
  });
};
