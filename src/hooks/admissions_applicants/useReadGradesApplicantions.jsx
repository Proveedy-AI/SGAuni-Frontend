import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadGradesApplicantions = (uuid, open, params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['admission_applications', params],
    queryFn: async () => {
      if (!uuid) throw new Error('UUID is required to fetch grades applications');
      const res = await axiosPrivate.get(`/api/v1/admission-applications/report-grades/${uuid}/`, {
        params,
      });
      return res.data;
    },
    enabled: !!uuid && open
  });
};
