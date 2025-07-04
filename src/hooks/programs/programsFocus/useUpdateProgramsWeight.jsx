// src/hooks/countries/useUpdateCountry.jsx
import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';


export const useUpdateProgramsWeight = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ id, payload }) => {
			const res = await axiosPrivate.patch(
				`/api/v1/focus-weights/${id}/`,
				payload
			);
			return res.data;
		},
	});
};
