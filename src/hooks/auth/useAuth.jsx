import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const login = async (email, password) => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.post(
				import.meta.env.VITE_API_URL + '/auth/login',
				{
					email,
					password,
				}
			);

			const message = response.data;

			if (message.is_authenticated) {
				const isProduction = import.meta.env.VITE_IS_PRODUCTION === 'true';
				const cookieOptions = {
					secure: true,
					sameSite: 'strict',
				};
				if (isProduction) {
					cookieOptions.domain = import.meta.env.VITE_DOMAIN_AUTO_LOGIN;
				}

				Cookies.set(
					import.meta.env.VITE_US_COOKIE,
					JSON.stringify(message),
					cookieOptions
				);

				navigate('/');
			}
		} catch (err) {
			setError(err.response ? err.response.data.message : 'Error de red');
		} finally {
			setLoading(false);
		}
	};

	const verify2FA = async (email, verification_code, secret_key) => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.post(
				import.meta.env.VITE_API_URL + '/auth/verify-2fa-code',
				{
					email,
					verification_code,
					secret_key,
				}
			);

			const message = response.data;

			const isProduction = import.meta.env.VITE_IS_PRODUCTION === 'true';
			const cookieOptions = {
				secure: true,
				sameSite: 'strict',
			};
			if (isProduction) {
				cookieOptions.domain = import.meta.env.VITE_DOMAIN_AUTO_LOGIN;
			}

			Cookies.set(
				import.meta.env.VITE_US_COOKIE,
				JSON.stringify(message),
				cookieOptions
			);

			navigate('/');
		} catch (err) {
			setError(err.response ? err.response.data.message : 'Error de red');
		} finally {
			setLoading(false);
		}
	};

	const getUser = useCallback(() => {
		const userCookie = Cookies.get(import.meta.env.VITE_US_COOKIE);
		if (!userCookie) return null;
		const getUserCookie = JSON.parse(userCookie);
		if (!getUserCookie?.access_token) return null;
		const decoded = jwtDecode(getUserCookie.access_token);
		return decoded;
	}, []);

	const getToken = useCallback(() => {
		const userCookie = Cookies.get(import.meta.env.VITE_US_COOKIE);
		if (!userCookie) return null;
		const getUserCookie = JSON.parse(userCookie);
		return getUserCookie?.access_token || null;
	}, []);

	const logout = async (email) => {
		const token = getToken();
		try {
			await axios.post(
				import.meta.env.VITE_API_URL + '/auth/logout',
				{
					email,
					access_token: token,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const isProduction = import.meta.env.VITE_IS_PRODUCTION === 'true';
			const cookieOptions = {
				domain: isProduction
					? import.meta.env.VITE_DOMAIN_AUTO_LOGIN
					: undefined,
			};
			Cookies.remove(import.meta.env.VITE_US_COOKIE, cookieOptions);

			navigate('/auth/login');
		} catch (err) {
			setError(err.response ? err.response.data.message : 'Error de red');
		}
	};

	return { error, loading, login, verify2FA, logout, getUser, getToken };
};
