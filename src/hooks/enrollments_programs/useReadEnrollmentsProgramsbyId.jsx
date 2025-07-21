import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadEnrollmentsProgramsbyId = (id, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['programs-id', id],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/enrollment-programs/${id}/`);
			return res.data;
		},
		enabled: !!id && id !== null && (options.enabled ?? true), // ✅ Solo se ejecuta si hay id y options.enabled no es false
		...options,
	});
};
