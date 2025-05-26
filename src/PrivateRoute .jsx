import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useReadRolesAndPermissions } from './hooks/users';
import { useAuth } from './hooks/auth';

export const PrivateRoute = () => {
	const { getToken, getUser } = useAuth();
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	const [expirationTimeout, setExpirationTimeout] = useState(null);

	const checkTokenValidity = () => {
		const token = getToken();
		const user = getUser();

		if (!token || !user) {
			setIsAuthenticated(false);
			return;
		}

		try {
			const currentTime = Math.floor(Date.now() / 1000); // Obtener la hora actual en segundos

			// Verificar si el token está expirado
			if (user.exp < currentTime) {
				console.warn('Token expirado.');
				Cookies.remove(import.meta.env.VITE_US_COOKIE);
				setIsAuthenticated(false);
			} else {
				// Verificar permisos (si es necesario)
				if (user.sub) {
					setIsAuthenticated(true);

					const timeUntilExpiration = user.exp - currentTime;

					if (timeUntilExpiration > 0) {
						// Limpiar el temporizador anterior si existe
						if (expirationTimeout) {
							clearTimeout(expirationTimeout);
						}

						const timeBeforeExpiration = timeUntilExpiration + 1;

						const newTimeout = setTimeout(() => {
							checkTokenValidity(); // Verificar el token antes de que expire
						}, timeBeforeExpiration * 1000);

						setExpirationTimeout(newTimeout);
					}
				} else {
					setIsAuthenticated(false);
				}
			}
		} catch (error) {
			console.error('Error al verificar el token:', error);
			setIsAuthenticated(false);
		}
	};

	useEffect(() => {
		checkTokenValidity();

		return () => {
			if (expirationTimeout) {
				clearTimeout(expirationTimeout);
			}
		};
	}, []);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden) {
				checkTokenValidity();
			}
		};

		const handleWakeUp = () => {
			checkTokenValidity();
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('focus', handleWakeUp);

		return () => {
			document.removeEventListener(
				'visibilitychange',
				handleVisibilityChange
			);
			window.removeEventListener('focus', handleWakeUp);
		};
	}, []);

	if (isAuthenticated === null) {
		return (
			<Flex
				height='100vh'
				alignItems='center'
				justifyContent='center'
				bg='gray.100'
			>
				<Spinner size='xl' color='blue.500' />
			</Flex>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to='/auth/login' replace />;
	}

	return <Outlet />;
};

export const ProtectedRoute = ({ requiredPermission }) => {
	const { permissions } = useReadRolesAndPermissions();
	const location = useLocation();

	if (!permissions || permissions.length === 0) {
		return null;
	}

	const hasPermission = Array.isArray(requiredPermission)
		? requiredPermission.some((perm) => permissions.includes(perm.trim()))
		: permissions.includes(requiredPermission.trim());

	if (!hasPermission) {
		return <Navigate to='/' replace state={{ from: location }} />;
	}

	return <Outlet />;
};

ProtectedRoute.propTypes = {
	requiredPermission: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
	]),
};
