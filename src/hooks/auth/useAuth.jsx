import { AuthContext } from '@/context';
import { useContext, useDebugValue } from 'react';

export const useAuth = () => {
	const { auth } = useContext(AuthContext);
	useDebugValue(auth, (auth) =>
		auth?.accessToken ? 'Logged In' : 'Logged Out'
	);
	return useContext(AuthContext);
};
