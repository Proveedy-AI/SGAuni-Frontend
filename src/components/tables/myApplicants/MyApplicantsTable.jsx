//import { UpdateSettingsCountryForm } from '@/components/forms';
import { Pagination, toaster } from '@/components/ui';
import { Badge, Box, Table } from '@chakra-ui/react';

import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';

import { useNavigate } from 'react-router';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { PreviewAdmissionsProgramsModal } from '@/components/forms/admissions';

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
	const navigate = useNavigate();
	const statusMap = {
		Incompleto: { label: 'Incompleto', color: 'yellow.400' }, // Amarillo para incompleto
		Completado: { label: 'Completado', color: 'blue.500' }, // Azul para completado
		Evaluado: { label: 'Evaluado', color: 'teal.500' }, // Verde azulado para evaluado
		Admitido: { label: 'Admitido', color: 'green.500' }, // Verde para admitido
		Rechazado: { label: 'Rechazado', color: 'red.500' }, // Rojo para rechazado
	};

	const handleRowClick = (e) => {
		if (e.target.closest('button') || e.target.closest('a')) return;

		const now = new Date();
		const examEnd = item.exam_date_end ? new Date(item.exam_date_end) : null;
		const isIncomplete = item.status_display === 'Incompleto';

		if (examEnd && isIncomplete && now > examEnd) {
			// Puedes mostrar una alerta o toast si quieres
			toaster.create({
				title: 'Acceso denegado',
				description:
					'No se puede acceder: el Proceso de postulación terminó y está incompleto.',
				type: 'error',
			});
			return;
		}

		EncryptedStorage.save('selectedApplicant', item);
		navigate(`/admissions/myapplicants/proccess`, {
			state: { item },
		});
	};

	return (
		<Table.Row
			onClick={handleRowClick}
			key={item.id}
			bg={index % 2 === 0 ? 'gray.100' : 'white'} // tu color alternado aquí
			_hover={{
				bg: 'blue.100',
				cursor: 'pointer',
			}}
		>
			<Table.Cell>
				{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
					? data.length - (startIndex + index)
					: startIndex + index + 1}
			</Table.Cell>
			<Table.Cell>{item.admission_process_name}</Table.Cell>
			<Table.Cell>{item.postgraduate_name}</Table.Cell>
			<Table.Cell>{item.postgraduate_type}</Table.Cell>
			<Table.Cell>{item.modality_display}</Table.Cell>

			<Table.Cell>
				{(() => {
					const status = statusMap[item.status_display] || {
						label: item.status_display,
						color: 'default',
					};
					return (
						<Badge variant='solid' bg={status.color}>
							{status.label}
						</Badge>
					);
				})()}
			</Table.Cell>
			<Table.Cell>
				<PreviewAdmissionsProgramsModal statusMap={statusMap} data={item} />
			</Table.Cell>
		</Table.Row>
	);
});

Row.displayName = 'Row';

Row.propTypes = {
	item: PropTypes.object,
	fetchData: PropTypes.func,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	permissions: PropTypes.array,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
};

export const MyApplicantsTable = ({
	data,
	fetchData,
	permissions,
	isLoading,
}) => {
	const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
	const [currentPage, setCurrentPage] = useState(1);
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const [sortConfig, setSortConfig] = useState(null);
	const sortedData = useMemo(() => {
		if (!sortConfig) return data;

		const sorted = [...data];

		if (sortConfig.key === 'index') {
			return sortConfig.direction === 'asc' ? sorted : sorted.reverse();
		}
		return sorted.sort((a, b) => {
			const aVal = a[sortConfig.key];
			const bVal = b[sortConfig.key];

			if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
			if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
			return 0;
		});
	}, [data, sortConfig]);

	const visibleRows = sortedData?.slice(startIndex, endIndex);

	return (
		<Box
			bg={{ base: 'white', _dark: 'its.gray.500' }}
			p='3'
			borderRadius='10px'
			overflow='hidden'
			boxShadow='md'
		>
			<Table.ScrollArea>
				<Table.Root size='sm' w='full'>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>
								<SortableHeader
									label='N°'
									columnKey='index'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Proceso de admisión'
									columnKey='admission_process_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Programa'
									columnKey='postgraduate_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Tipo'
									columnKey='postgraduate_type'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Modalidad'
									columnKey='modality_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>

							<Table.ColumnHeader>Estado de Postulacion</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading ? (
							<SkeletonTable columns={8} />
						) : visibleRows?.length > 0 ? (
							visibleRows?.map((item, index) => (
								<Row
									key={item.id}
									item={item}
									data={data}
									sortConfig={sortConfig}
									permissions={permissions}
									fetchData={fetchData}
									startIndex={startIndex}
									index={index}
								/>
							))
						) : (
							<Table.Row>
								<Table.Cell colSpan={8} textAlign='center' py={2}>
									No hay datos disponibles.
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Root>
			</Table.ScrollArea>

			<Pagination
				count={data?.length}
				pageSize={pageSize}
				currentPage={currentPage}
				pageSizeOptions={pageSizeOptions}
				onPageChange={setCurrentPage}
				onPageSizeChange={(size) => {
					setPageSize(size);
					setCurrentPage(1);
				}}
			/>
		</Box>
	);
};

MyApplicantsTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	loading: PropTypes.bool,
	permissions: PropTypes.array,
	isLoading: PropTypes.bool,
};
