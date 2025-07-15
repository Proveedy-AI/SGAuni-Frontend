// src/hooks/countries/useUpdateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useMarkAllReadNotifications = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ payload }) => {
      const res = await axiosPrivate.put(
        `/api/v1/notifications/mark_all_as_read/`,
        payload
      );
      return res.data;
    },
  });
};
