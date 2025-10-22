import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';


export const useAssignUserRole = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ userId, roleIds }) => {
      const res = await axiosPrivate.post(`/api/v1/users/${userId}/assign_roles/`, {
        roles_ids: roleIds
      });
      return res.data;
    }
  });
};
