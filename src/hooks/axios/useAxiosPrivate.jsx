import { axiosPrivate } from '@/api/axios';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useAuth, useProvideAuth } from '../auth';
import { Navigate } from 'react-router';

const useAxiosPrivate = () => {
	const { refresh, error: authError } = useProvideAuth();
	const { auth } = useAuth();

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
					if (!newAccessToken) {
						const isProduction = import.meta.env.VITE_IS_PRODUCTION === 'true';
						const cookieOptions = {
							domain: isProduction
								? import.meta.env.VITE_DOMAIN_AUTO_LOGIN
								: undefined,
						};
						Cookies.remove(import.meta.env.VITE_US_COOKIE, cookieOptions);
						Cookies.remove(import.meta.env.VITE_TOKEN_COOKIE, cookieOptions);
						Navigate('/auth/login')
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
