import axios from '@/api/axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '.';

export const useProvideAuth = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { auth, setAuth } = useAuth();
	const isRefreshing = useRef(false);

	const getRefreshToken = useCallback(() => {
		const cookie = Cookies.get(import.meta.env.VITE_TOKEN_COOKIE);
		const userCookie = cookie ? JSON.parse(cookie) : null;
		if (!userCookie) return null;
		const decoded = userCookie?.refresh;
		return decoded /* ?.refresh_token */ || null;
	}, []);

	const login = async (username, password) => {
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post('/api-auth/token/obtain/', {
				username,
				password,
			});

			const data = response.data;

			const user = jwtDecode(data['access']);
			setAuth({ accessToken: data['access'], user, refresh: data['refresh'] });

			const isProduction = import.meta.env.VITE_IS_PRODUCTION === 'true';
			const cookieOptions = {
				secure: true,
				sameSite: 'strict',
				httpOnly: false,
			};
			if (isProduction) {
				cookieOptions.domain = import.meta.env.VITE_DOMAIN_AUTO_LOGIN;
			}
			Cookies.set(
				import.meta.env.VITE_TOKEN_COOKIE,
				JSON.stringify({
					accessToken: data['access'],
					user,
					refresh: data['refresh'],
				}),
				cookieOptions
			);

			navigate('/');
		} catch (err) {
			setError(err.response ? err.response.data.detail : 'Error de red');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		setError(null);

		const token = getRefreshToken();
		const accessToken = getAccessToken();

		const isProduction = import.meta.env.VITE_IS_PRODUCTION === 'true';
		const cookieOptions = {
			domain: isProduction ? import.meta.env.VITE_DOMAIN_AUTO_LOGIN : undefined,
		};

		try {
			await axios.post(
				'/api-auth/token/blacklist/',
				{ refresh: token },
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
		} catch (err) {
			if (err.response) {
				setError(err.response.data.detail || 'Error desconocido del servidor');
			} else {
				setError('Error de red o token inválido');
			}
		} finally {
			Cookies.remove(import.meta.env.VITE_TOKEN_COOKIE, cookieOptions);
			setAuth(null);
			navigate('/auth/login');
			setLoading(false);
		}
	};

	const refresh = async () => {
		setLoading(true);
		setError(null);
		if (isRefreshing.current) return;
		isRefreshing.current = true;

		try {
			const response = await axios.post('api-auth/token/refresh/', {
				refresh: getRefreshToken(),
			});

			const data = response.data;
			const user = jwtDecode(data['access']);
			setAuth({ accessToken: data['access'], user, refresh: data['refresh'] });

			const isProduction = import.meta.env.VITE_IS_PRODUCTION === 'true';
			const cookieOptions = {
				secure: true,
				sameSite: 'strict',
				httpOnly: false,
			};
			if (isProduction) {
				cookieOptions.domain = import.meta.env.VITE_DOMAIN_AUTO_LOGIN;
			}
			Cookies.set(
				import.meta.env.VITE_TOKEN_COOKIE,
				JSON.stringify({
					accessToken: data['access'],
					user,
					refresh: data['refresh'],
				}),
				cookieOptions
			);

			return response.data['access'];
		} catch (err) {
			console.error('[refresh] Error al refrescar el token:', err);
			const isProduction = import.meta.env.VITE_IS_PRODUCTION === 'true';
			const cookieOptions = {
				domain: isProduction
					? import.meta.env.VITE_DOMAIN_AUTO_LOGIN
					: undefined,
			};
			Cookies.remove(import.meta.env.VITE_TOKEN_COOKIE, cookieOptions);
			setAuth(null);
			navigate('/auth/login');
			setLoading(false);
		} finally {
			isRefreshing.current = false;
			setLoading(false);
		}
	};

	const getUser = useCallback(() => {
		const user = auth?.user;
		return user;
	}, []);

	const getUserCookie = useCallback(() => {
		try {
			const cookie = Cookies.get(import.meta.env.VITE_TOKEN_COOKIE);
			const userCookie = cookie ? JSON.parse(cookie) : null;
			if (!userCookie) return null;
			const decoded = userCookie?.refresh;
			const parsed = jwtDecode(decoded);
			return parsed;
		} catch (error) {
			console.error('Error al obtener el usuario:', error);
			return null;
		}
	}, []);

	const getAccessToken = useCallback(() => {
		try {
			const cookie = Cookies.get(import.meta.env.VITE_TOKEN_COOKIE);
			if (!cookie) return null;
			const parsed = JSON.parse(cookie);
			return parsed?.accessToken || null;
		} catch (err) {
			console.error('[getAccessToken] Error al parsear cookie:', err);
			return null;
		}
	}, []);

	return {
		login,
		logout,
		refresh,
		getUser,
		getUserCookie,
		getAccessToken,
		getRefreshToken,
		error,
		loading,
	};
};
