import { Flex, Spinner } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useProvideAuth } from './hooks/auth';
import { useReadUserLogged } from './hooks/users/useReadUserLogged';
import { useCheckPersonHasDebts } from './hooks';

import { ApplicantHasDebts } from './components/control';

export const PrivateRoute = () => {
	const { getUser, getUserCookie, refresh, loading, getRefreshToken } =
		useProvideAuth();

	const [isAuthenticated, setIsAuthenticated] = useState(null);
	const [expirationTimeout, setExpirationTimeout] = useState(null);

	const checkTokenValidity = () => {
		const token = getRefreshToken();
		const user = getUserCookie();

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
				if (user.user_id) {
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

	const checkAuth = () => {
		const user = getUser();
		if (!user) {
			refresh();
		}
	};

	useEffect(() => {
		checkTokenValidity();
		checkAuth();

		return () => {
			if (expirationTimeout) {
				clearTimeout(expirationTimeout);
			}
		};
	}, []);

	useEffect(() => {
		const onWakeUp = () => {
			checkTokenValidity();
		};

		document.addEventListener('visibilitychange', onWakeUp);
		window.addEventListener('focus', onWakeUp);

		return () => {
			document.removeEventListener('visibilitychange', onWakeUp);
			window.removeEventListener('focus', onWakeUp);
		};
	}, []);

	if (isAuthenticated === null || loading) {
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

export const ProtectedRoute = ({
	requiredPermission,
	requiredDebt = false,
}) => {
	const { data: profile } = useReadUserLogged();
	const location = useLocation();

	// Always call hooks at the top level
	const { data: dataCondition } = useCheckPersonHasDebts(profile?.uuid, {
		enable: requiredDebt,
	});

	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	// Mostrar spinner si aún no hay permisos disponibles
	if (!profile || roles.length === 0) {
		return (
			<Flex
				height='100vh'
				alignItems='center'
				justifyContent='center'
				bg='gray.100'
			>
				<Spinner size='lg' color='blue.500' />
			</Flex>
		);
	}

	const hasPermission = Array.isArray(requiredPermission)
		? requiredPermission.some((perm) => permissions.includes(perm.trim()))
		: permissions.includes(requiredPermission.trim());

	if (!hasPermission) {
		return <Navigate to='/' replace state={{ from: location }} />;
	}

	let userHasDebts = false;
	if (requiredDebt) {
		//const dataCondition = { has_debt: true, can_request_installment: true };
		userHasDebts = dataCondition?.has_debt || false;
		if (userHasDebts) {
			return <ApplicantHasDebts data={dataCondition} />;
		}
		// console.log('Verificando deudas del usuario...');
	}

	return <Outlet />;
};

ProtectedRoute.propTypes = {
	requiredPermission: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
	]).isRequired,
	requiredDebt: PropTypes.bool,
};
