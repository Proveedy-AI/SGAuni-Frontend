// src/hooks/countries/useUpdateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUpdateEnrollments = () => {
    const axiosPrivate = useAxiosPrivate();

    return useMutation({
        mutationFn: async ({ id, payload }) => {
            const res = await axiosPrivate.patch(
                `/api/v1/enrollment-processes/${id}/`,
                payload
            );
            return res.data;
        },
    });
};
