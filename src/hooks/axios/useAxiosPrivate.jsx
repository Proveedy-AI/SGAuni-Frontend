import { axiosPrivate } from '@/api/axios';
import { useEffect } from 'react';
import { useAuth, useProvideAuth } from '../auth';
import { useNavigate } from 'react-router';

const useAxiosPrivate = () => {
	const { refresh } = useProvideAuth();
	const { auth } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers['Authorization']) {
					config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config;
				if (error?.response?.status === 401 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refresh();
					if (error?.response?.status === 401 && !newAccessToken) {
						navigate('/auth/login'); // 👈 redirige si no se pudo refrescar
						return Promise.reject(error);
					}
					// setAuth({ accessToken: newAccessToken });
					/* axiosPrivate.defaults.headers.common['Authorization'] =
						`Bearer ${newAccessToken}`; */
					prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
					return axiosPrivate(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
			axiosPrivate.interceptors.response.eject(responseIntercept);
		};
	}, [auth, refresh]);

	return axiosPrivate;
};

export default useAxiosPrivate;
