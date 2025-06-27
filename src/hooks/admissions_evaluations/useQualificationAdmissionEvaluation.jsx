// src/hooks/countries/useUpdateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useQualificationAdmissionEvaluation = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axiosPrivate.patch(
        `/api/v1/admission-evaluations/${id}/grade/`,
        payload
      );
      return res.data;
    },
  });
};
