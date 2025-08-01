import { useState, useEffect, useCallback } from 'react';

export const usePaginatedInfiniteData = ({
	data,
	pageSize,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
}) => {
	const [currentPage, setCurrentPage] = useState(1);

	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;

	const visibleRows = data?.slice(startIndex, endIndex);

	// Autocarga si faltan datos
	useEffect(() => {
		const totalLoadedItems = data?.length ?? 0;
		const neededItems = currentPage * pageSize;

		if (neededItems > totalLoadedItems && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [
		currentPage,
		pageSize,
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	]);

	// Carga hasta una página específica
	const loadUntilPage = useCallback(
		async (targetPage) => {
			const clampedPage = Math.max(1, targetPage);
			const totalNeededItems = clampedPage * pageSize;

			let currentItemCount = data.length;

			// Intentar cargar mientras falten datos y haya más páginas
			while (currentItemCount < totalNeededItems && hasNextPage) {
				const prevCount = currentItemCount;
				await fetchNextPage();
				currentItemCount = data.length;

				// 🔒 Protección: Si no llegan más datos, corta
				if (currentItemCount === prevCount) {
					console.warn('⚠️ No se cargaron más datos. Evitando bucle infinito.');
					break;
				}
			}

			setCurrentPage(clampedPage);
		},
		[data, pageSize, fetchNextPage, hasNextPage]
	);

	return {
		currentPage,
		setCurrentPage,
		startIndex,
		endIndex,
		visibleRows,
		loadUntilPage,
	};
};
