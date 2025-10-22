import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useUpdatePerson = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({ id, payload }) => {
			const response = await axiosPrivate.patch(`/api/v1/persons/${id}/`, payload);
			return response.data;
		},
	});
};
