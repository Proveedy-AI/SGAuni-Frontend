// src/hooks/usePaginationSettings.js
import { useState } from 'react';

const defaultOptions = [
	{ label: '10', value: 10 },
	{ label: '30', value: 30 },
	{ label: '50', value: 50 },
	{ label: '100', value: 100 },
	// no incluimos 'Todos' (Infinity)
];

export const usePaginationSettings = () => {
	const [pageSize, setPageSize] = useState(defaultOptions[0].value);
	const [pageSizeOptions] = useState(defaultOptions);

	return {
		pageSize,
		setPageSize,
		pageSizeOptions,
	};
};
