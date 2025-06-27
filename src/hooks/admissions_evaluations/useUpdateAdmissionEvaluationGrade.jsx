// src/hooks/countries/useUpdateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUpdateAdmissionEvaluationGrade = () => {
    const axiosPrivate = useAxiosPrivate();

    return useMutation({
        mutationFn: async ({ uuid, payload }) => {
            const res = await axiosPrivate.patch(
                `/api/v1/admission-evaluations/${uuid}/grade/`,
                payload
            );
            return res.data;
        },
    });
};
