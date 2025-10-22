import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadCoursesToEnroll = (enrollmentId, params={}, options={}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['courses-to-enroll', enrollmentId],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/person/enrollments/${enrollmentId}/courses-to-enroll/`, {
        params: { ...params },
      });
      return res.data;
    },
    ...options,
  });
};