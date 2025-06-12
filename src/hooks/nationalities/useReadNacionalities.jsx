import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axios';

export const useReadNacionalities = (params = {}) => {

  return useQuery({
    queryKey: ['nationalities', params],
    queryFn: async () => {
      const res = await axios.get('/api/v1/nationalities/', { params });
      return res.data;
    },
  });
};
