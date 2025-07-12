// src/hooks/countries/useCreateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useCreateProgramsReview = () => {
    const axiosPrivate = useAxiosPrivate();

    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosPrivate.patch(
                `/api/v1/enrollment-programs/${id}/review/`
            );

            console.log(res.data)
            return res.data;
        },
    });
};
