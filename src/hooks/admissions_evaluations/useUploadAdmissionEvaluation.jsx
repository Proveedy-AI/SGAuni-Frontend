// src/hooks/countries/useUpdateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUploadAdmissionEvaluation = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axiosPrivate.patch(
        `/api/v1/admission-evaluations/${id}/essay/`,
        payload
      );
      return res.data;
    },
  });
};
