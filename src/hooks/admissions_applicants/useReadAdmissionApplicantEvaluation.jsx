// src/hooks/admissions/useReadAdmissionById.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadAdmissionApplicantEvaluation = (uuid) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['admission_applications', uuid],
    queryFn: async () => {
      if (!uuid) throw new Error('ID requerido');
      const res = await axiosPrivate.get(`/api/v1/admission-applications/evaluations/${uuid}/`);
      return res.data;
    },
    enabled: !!uuid, // solo corre si hay un uuid válido
  });
};

