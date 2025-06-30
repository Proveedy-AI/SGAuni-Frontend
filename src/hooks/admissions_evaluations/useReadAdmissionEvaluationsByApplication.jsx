// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissionEvaluationsByApplication = (applicantId, open) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['admission_evaluations', applicantId],
    queryFn: async () => {
      const res = await axiosPrivate.get(`api/v1/admission-evaluations/by-application/${applicantId}/`,
        {
          enabled: !!applicantId && open,
        }
      );
      return res.data;
    },
  });
};
