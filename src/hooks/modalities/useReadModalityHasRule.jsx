import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadModalityHasRule = (modalityId, params = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    queryKey: ['modality_has_rule', modalityId, params],
    mutationFn: async (modalityId) => {
      const res = await axiosPrivate.post(`/api/v1/admission-modalities/${modalityId}/get_rules/`);
      return res.data;
    },
    enabled: !!modalityId, // evita la llamada si no hay id
  });
};
