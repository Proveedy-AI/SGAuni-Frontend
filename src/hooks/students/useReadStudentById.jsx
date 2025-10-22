// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadStudentById = (id) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['admission_applications', id],
    queryFn: async () => {
      if (!id) throw new Error('ID requerido');
      const res = await axiosPrivate.get(`/api/v1/students/${id}/`);
      return res.data;
    },
    enabled: !!id, // solo corre si hay un id válido
  });
};
