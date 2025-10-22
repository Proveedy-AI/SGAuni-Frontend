import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadInstallmentsStudents = (uuid, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['students-installments', uuid],
		queryFn: async () => {
			const res = await axiosPrivate.get(
				`/api/v1/students/installments/${uuid}/`
			);
			return res.data;
		},
		...options, // permite pasar enabled, staleTime, select, etc.
	});
};
