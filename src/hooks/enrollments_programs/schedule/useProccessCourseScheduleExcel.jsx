// src/hooks/countries/useCreateCountry.jsx
import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';


export const useProccessCourseScheduleExcel = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({id, payload }) => {
			const res = await axiosPrivate.post(
				`/api/v1/enrollment-programs/${id}/schedule-excel/process/`,
				payload
			);
			return res.data;
		},
	});
};
