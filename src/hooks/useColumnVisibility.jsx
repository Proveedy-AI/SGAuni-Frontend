import { useState, useEffect } from 'react';

export const useColumnVisibility = (
	columnsConfig,
	storageKey = 'visibleColumns'
) => {
	const [visibleColumns, setVisibleColumns] = useState(() => {
		const savedColumns = localStorage.getItem(storageKey);
		const storedColumns = savedColumns ? JSON.parse(savedColumns) : {};

		// Eliminar columnas que ya no existen en `columnsConfig`
		const filteredColumns = Object.keys(storedColumns)
			.filter((key) => columnsConfig[key]) // Solo mantener claves que existen en columnsConfig
			.reduce((obj, key) => {
				obj[key] = storedColumns[key];
				return obj;
			}, {});

		// Fusionar `columnsConfig` con lo guardado en localStorage, respetando el ORDEN de `columnsConfig`
		const mergedColumns = Object.keys(columnsConfig).reduce((obj, key) => {
			obj[key] = filteredColumns[key] || columnsConfig[key]; // Prioriza guardado, pero respeta orden
			return obj;
		}, {});

		return mergedColumns;
	});

	// Guardar en localStorage solo si hay cambios
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
	}, [visibleColumns, storageKey]);

	const toggleColumnVisibility = (column) => {
		setVisibleColumns((prev) => {
			const updatedColumns = {
				...prev,
				[column]: {
					...prev[column],
					visible: !prev[column].visible,
				},
			};

			localStorage.setItem(storageKey, JSON.stringify(updatedColumns));
			return updatedColumns;
		});
	};

	return { visibleColumns, toggleColumnVisibility };
};
