// src/hooks/permissions/useReadPermissions.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadOneModality = ({ id, enabled = true }) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['modalities', id],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/v1/admission-modalities/${id}/`);
      return res.data;
    },
    enabled: !!id && enabled,
  });
};
