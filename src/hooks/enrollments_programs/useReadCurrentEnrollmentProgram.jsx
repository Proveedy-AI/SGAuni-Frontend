// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadCurrentEnrollmentProgram = (programId, isModalOpen=true) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['current-enrollment-program', programId, isModalOpen],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/enrollment-programs/${programId}/current-enrollment-program/`);
      return res.data;
    },
    enabled: !!programId && isModalOpen,
  });
};
