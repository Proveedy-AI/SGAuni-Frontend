// src/hooks/countries/useReadCountries.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadEnrollmentsPrograms = (params = {}) => {
    const axiosPrivate = useAxiosPrivate();

    return useQuery({
        queryKey: ['enrollment-programs', params],
        queryFn: async () => {
            const res = await axiosPrivate.get(
                '/api/v1/enrollment-programs/',
                {
                    params,
                }
            );
            return res.data;
        },
    });
};
