import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import axios from 'axios';

export const useReadRolesAndPermissions = () => {
	const [loading, setLoading] = useState(false);
	const [roles, setRoles] = useState([]);
	const [permissions, setPermissions] = useState([]);
	const [error, setError] = useState(null);
	const { getToken, getUser } = useAuth();

	const fetchRolesAndPermissions = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const token = getToken();
			const user = getUser();

			if (!token) {
				throw new Error('El usuario no está autenticado.');
			}

			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/user/roles-and-permissions?user_id=${
					user.sub
				}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setRoles(response.data.roles || []);
			setPermissions(
				response.data.permissions?.map((p) => p.guard_name) || []
			);
		} catch (err) {
			setRoles([]);
			setPermissions([]);
			setError(
				err.response
					? err.response.data
					: 'A ocurrido un error al listar los datos.'
			);
		} finally {
			setLoading(false);
		}
	}, [getToken, getUser]);

	useEffect(() => {
		fetchRolesAndPermissions();
	}, []);

	return {
		loading,
		roles,
		permissions,
		error,
		fetchRolesAndPermissions,
	};
};
