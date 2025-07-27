import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadMyEnrolledCourses = (enrollmentId, options = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['my-enrolled-courses', enrollmentId],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/person/enrollments/my-courses/`, {
				params: { enrollment_period_program: enrollmentId }
			});
			return res.data;
		},
		enabled: !!enrollmentId,
		...options,
	});
};
