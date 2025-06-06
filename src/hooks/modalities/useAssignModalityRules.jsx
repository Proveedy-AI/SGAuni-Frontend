import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useAssignModalityRules = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (modalityId, rulesId) => {
      const res = await axiosPrivate.post(`/api/v1/admission-modalities/${modalityId}/assign_rules/`, {
        rules_ids: rulesId
      });
      return res.data;
    },
  });
};
