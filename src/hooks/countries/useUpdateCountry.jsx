// src/hooks/countries/useUpdateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUpdateCountry = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ id, payload }) => {
			const res = await axiosPrivate.patch(`/country/${id}`, payload);
			return res.data;
		},
	});
};
