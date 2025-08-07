import useAxiosPrivate from "@/hooks/axios/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";

export const useReadEnrollmentReport = (params = {}, option = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['enrollment-report', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/enrollment-programs/enrollment-report/', {
				params,
			});
			return res.data;
		},
		...option,
	});
};
