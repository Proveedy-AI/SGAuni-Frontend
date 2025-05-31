// src/hooks/permissions/useReadPermissions.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export const useReadPermissions = (params = {}) => {
	const axiosPrivate = useAxiosPrivate();

	return useQuery({
		queryKey: ['permissions', params],
		queryFn: async () => {
			const res = await axiosPrivate.get('/api/v1/permissions/', { params });
			return res.data;
		},
	});
};
