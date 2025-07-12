// src/hooks/admissions/useReadAdmissionById.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadEnrollmentById = (id) => {
    const axiosPrivate = useAxiosPrivate();

    return useQuery({
        queryKey: ['enrollment-byid', id],
        queryFn: async () => {
            if (!id) throw new Error('ID requerido');
            const res = await axiosPrivate.get(`/api/v1/enrollment-processes/${id}/`);
            return res.data;
        },
        enabled: !!id, // solo corre si hay un id válido
    });
};
