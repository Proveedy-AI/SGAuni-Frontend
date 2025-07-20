import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadProgramsbyId = (id, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['programs', id],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/postgraduate-programs/${id}/`);
			return res.data;
		},
		enabled: !!id && (options.enabled ?? true), // ✅ Solo se ejecuta si hay id y options.enabled no es false
		...options,
	});
};
