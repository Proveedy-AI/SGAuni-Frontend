// src/hooks/admissions/useReadAdmissionById.jsx
import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axios';

export const useReadAdmissionByUUID = (uuid) => {

  return useQuery({
    queryKey: ['admission-byid', uuid],
    queryFn: async () => {
      if (!uuid) throw new Error('ID requerido');
      const res = await axios.get(`/api/v1/admission-processes/by-uuid/${uuid}/`);
      return res.data;
    },
    enabled: !!uuid, // solo corre si hay un id válido
  });
};
