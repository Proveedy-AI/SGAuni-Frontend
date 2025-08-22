import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadProgramsEnrollmentCourses = (params = {}, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['programs-enrollment-courses', params],
		queryFn: async () => {
			const res = await axiosPrivate.get(
				`/api/v1/postgraduate-programs/${params.id}/enrollment-period/courses/`,
				{
					params,
				}
			);
			return res.data;
		},
		...options, // permite `enabled`, `refetchOnWindowFocus`, etc.
	});
};
