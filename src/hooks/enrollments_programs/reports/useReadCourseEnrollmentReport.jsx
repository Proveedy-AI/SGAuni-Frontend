import useAxiosPrivate from "@/hooks/axios/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";

export const useReadCourseEnrollmentReport = (courseGroupId, params = {}, option = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['course-enrollment-report', courseGroupId, params],
		queryFn: async () => {
			const res = await axiosPrivate.get(`/api/v1/course-groups/${courseGroupId}/course-enrollment-report/`, {
				params,
			});
			return res.data;
		},
		...option,
	});
};
