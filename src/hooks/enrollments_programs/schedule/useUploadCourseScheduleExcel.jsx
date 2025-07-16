// src/hooks/countries/useCreateCountry.jsx
import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';


export const useUploadCourseScheduleExcel = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async ({id, payload }) => {
			const res = await axiosPrivate.patch(
				`/api/v1/enrollment-programs/${id}/schedule-excel-url/`,
				payload
			);
			return res.data;
		},
	});
};
