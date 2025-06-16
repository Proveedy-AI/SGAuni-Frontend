// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissionEvaluations = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['admission_evaluations', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/admission-evaluations/', {
        params,
      });
      return res.data;
    },
  });
};
