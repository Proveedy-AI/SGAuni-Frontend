import PropTypes from 'prop-types';
import { useState } from 'react';
import { AuthContext } from '.';

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
