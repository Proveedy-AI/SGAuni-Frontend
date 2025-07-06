import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useDeleteEnrollments = () => {
    const axiosPrivate = useAxiosPrivate();

    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosPrivate.delete(
                `/api/v1/enrollment-processes/${id}/`
            );
            return res.data;
        },
    });
};
