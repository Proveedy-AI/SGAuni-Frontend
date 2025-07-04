// src/hooks/countries/useUpdateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUpdateNotifications = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ id }) => {
			const res = await axiosPrivate.patch(
				`/api/v1/admission-applications/notification/${id}/`
			);
			return res.data;
		},
	});
};
