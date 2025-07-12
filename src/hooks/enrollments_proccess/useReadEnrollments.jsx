// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadEnrollments = (params = {}) => {
    const axiosPrivate = useAxiosPrivate();

    return useQuery({
        queryKey: ['enrollment', params],
        queryFn: async () => {
            const res = await axiosPrivate.get('/api/v1/enrollment-processes/', {
                params,
            });
            return res.data;
        },
    });
};
