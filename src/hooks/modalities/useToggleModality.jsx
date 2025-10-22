import { useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useToggleModality = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (id) => {
			const res = await axiosPrivate.post(`/api/v1/admission-modalities/${id}/toggle_active/`);
			return res.data;
		},
	});
};
