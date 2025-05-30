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
	const { setAuth } = useAuth();
	const isRefreshing = useRef(false);

	const getRefreshToken = useCallback(() => {
		const userCookie = Cookies.get(import.meta.env.VITE_US_COOKIE);
		if (!userCookie) return null;
		// const getUserCookie = JSON.parse(userCookie);
		return userCookie /* ?.refresh_token */ || null;
	}, []);

	const login = async (username, password) => {
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post('api-auth/token/obtain/', {
				username,
				password,
			});

			const data = response.data;

			const user = jwtDecode(data['access']);
			setAuth({ accessToken: data['access'], user });

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
				JSON.stringify({ accessToken: data['access'], user }),
				cookieOptions
			);
			Cookies.set(
				import.meta.env.VITE_US_COOKIE,
				/* JSON.stringify(data) */
				data['refresh'],
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

		console.log('[1] Refresh token:', token);
		console.log('[2] Access token:', accessToken);

		const isProduction = import.meta.env.VITE_IS_PRODUCTION === 'true';
		const cookieOptions = {
			domain: isProduction ? import.meta.env.VITE_DOMAIN_AUTO_LOGIN : undefined,
		};

		axios
			.post(
				'api-auth/token/blacklist',
				{ refresh: token },
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'X-CSRFToken': Cookies.get('csrftoken'), // Si tu cookie se llama así
					},
					withCredentials: true, // MUY IMPORTANTE para que se envíen cookies en CORS
				}
			)
			.then((response) => {
				console.log('[3] Token invalidado correctamente:', response.data);

				Cookies.remove(import.meta.env.VITE_US_COOKIE, cookieOptions);
				Cookies.remove(import.meta.env.VITE_TOKEN_COOKIE, cookieOptions);
				console.log('[4] Cookie eliminada, redirigiendo al login...');
				navigate('/auth/login');
			})
			.catch((err) => {
				console.error('[ERROR] Error al invalidar token');
				if (err.response) {
					console.error('[Error response.data]', err.response.data);
					setError(
						err.response.data.detail || 'Error desconocido del servidor'
					);
				} else {
					console.error('[Error general]', err.message);
					setError('Error de red o token inválido');
				}
			})
			.finally(() => {
				console.log('[5] Logout completado (finally)');
				Cookies.remove(import.meta.env.VITE_US_COOKIE, cookieOptions);
				Cookies.remove(import.meta.env.VITE_TOKEN_COOKIE, cookieOptions);
				setAuth(null);
				navigate('/auth/login');
				setLoading(false);
			});
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
			setAuth({ accessToken: data['access'], user });
			const user = jwtDecode(data['access']);

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
				JSON.stringify({ accessToken: data['access'], user }),
				cookieOptions
			);
			Cookies.set(
				import.meta.env.VITE_US_COOKIE,
				/* JSON.stringify(data) */
				data['refresh'],
				cookieOptions
			);

			return response.data['access'];
		} catch (err) {
			setError(err.response ? err.response.data.detail : 'Error de red');
			throw err;
		} finally {
			isRefreshing.current = false;
			setLoading(false);
		}
	};

	const getUser = useCallback(() => {
		try {
			const cookie = Cookies.get(import.meta.env.VITE_TOKEN_COOKIE);
			if (!cookie) return null;
			const parsed = JSON.parse(cookie);
			return parsed?.user || null;
		} catch (err) {
			console.error('[getAccessToken] Error al parsear cookie:', err);
			return null;
		}
	}, []);

	const getUserCookie = useCallback(() => {
		try {
			const userCookie = Cookies.get(import.meta.env.VITE_US_COOKIE);
			if (!userCookie) return null;
			const decoded = jwtDecode(userCookie);
			return decoded;
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
