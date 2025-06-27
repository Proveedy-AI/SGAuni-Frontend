// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadProgramsForEvaluator = (params = {}) => {
    const axiosPrivate = useAxiosPrivate();

    return useQuery({
        queryKey: ['admission_evaluators', params],
        queryFn: async () => {
            const res = await axiosPrivate.get('/api/v1/admission-evaluators/programs_for_evaluator/', {
                params,
            });
            return res.data;
        },
    });
};
