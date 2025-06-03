// src/hooks/permissions/useReadPermissions.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadModalities = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['modalities', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/admission-modalities/', { params });
      return res.data;
    },
  });
};
