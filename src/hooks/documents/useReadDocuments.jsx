// src/hooks/permissions/useReadPermissions.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadDocuments = (params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['documents', params],
    queryFn: async () => {
      const res = await axiosPrivate.get('/api/v1/document-applications/', { params });
      return res.data;
    },
  });
};
