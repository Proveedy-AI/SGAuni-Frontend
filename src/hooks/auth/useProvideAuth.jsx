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
	const { setAuth, auth } = useAuth();
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
				import.meta.env.VITE_US_COOKIE,
				/* JSON.stringify(data) */
				data['refresh'],
				cookieOptions
			);

			navigate('/');
		} catch (err) {
			setError(err.response ? err.response.data.message : 'Error de red');
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		setError(null);
		const token = getRefreshToken();
		console.log('Logout token:', token);
		try {
			// Enviar el refresh token a la API para revocar el acceso
			await axios.post(
				'api-auth/token/blacklist', // URL de la API que invalidará el refresh token
				{ refresh: token }, // Se pasa el refresh token en el cuerpo de la solicitud
				{
					headers: {
						Authorization: `Bearer ${token}`, // El Authorization header con el refresh token
					},
				}
			);

			// Una vez que la API responda correctamente, procederemos con el logout
			const isProduction = import.meta.env.VITE_IS_PRODUCTION === 'true';
			const cookieOptions = {
				domain: isProduction
					? import.meta.env.VITE_DOMAIN_AUTO_LOGIN
					: undefined,
			};

			// Limpiar el estado de autenticación y eliminar las cookies
			setAuth(null);
			Cookies.remove(import.meta.env.VITE_US_COOKIE, cookieOptions);

			// Redirigir a la página de login
			navigate('/auth/login');
		} catch (err) {
			setError(err.response ? err.response.data.detail : 'Error de red');
			throw err;
		} finally {
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
			console.log('Refrescando token:', data);
			const user = jwtDecode(data['access']);

			setAuth((prev) => ({
				...prev,
				accessToken: data['access'],
				user,
			}));
			console.log('Estado actualizado en auth:', {
				accessToken: data['access'],
				user,
			});

			return response.data['access'];
		} catch (err) {
			setError(err.response ? err.response.data.message : 'Error de red');

			// Esto es clave para que PrivateRoute sepa que falló y actúe.
			throw err;
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
		return auth?.accessToken;
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
