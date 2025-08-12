import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Badge, Box, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';

import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
	const statusDisplay = [
		{ id: 7, label: 'No Matriculado', color: 'gray' },
		{ id: 1, label: 'Pago Pendiente', color: 'orange' },
		{ id: 2, label: 'Pago Parcial', color: 'blue' },
		{ id: 3, label: 'Pago Vencido', color: 'red' },
		{ id: 4, label: 'Elegible', color: 'yellow' },
		{ id: 5, label: 'Matriculado', color: 'green' },
		{ id: 6, label: 'Cancelado', color: 'purple' },
	];

	const matchStatus = statusDisplay.find((status) => status.id === item.status);

	return (
		<Table.Row
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
			<Table.Cell>{item.student_full_name}</Table.Cell>
			<Table.Cell>{item.program_period}</Table.Cell>
			<Table.Cell>{item.program_name}</Table.Cell>
			<Table.Cell>
				{item.is_first_enrollment ? (
					<Badge colorPalette='green'>Sí</Badge>
				) : (
					<Badge colorPalette='red'>No</Badge>
				)}
			</Table.Cell>
			<Table.Cell>
				<Badge colorPalette={matchStatus?.color}>
					{matchStatus?.label || 'N/A'}
				</Badge>
			</Table.Cell>
			<Table.Cell></Table.Cell>
		</Table.Row>
	);
});

Row.displayName = 'Row';

Row.propTypes = {
	item: PropTypes.object,
	fetchData: PropTypes.func,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
};

export const StudentTuitionTable = ({ data, fetchData, isLoading }) => {
	const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
	const [currentPage, setCurrentPage] = useState(1);
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const [sortConfig, setSortConfig] = useState(null);
	const sortedData = useSortedData(data, sortConfig);
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
						<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
							<Table.ColumnHeader w='5%'>
								<SortableHeader
									label='N°'
									columnKey='index'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Estudiante'
									columnKey='student_full_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Periodo'
									columnKey='program_period'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>

							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Programa'
									columnKey='program_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='15%'>
								<SortableHeader
									label='Primera Inscripción'
									columnKey='is_first_enrollment'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Estado'
									columnKey='status_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='10%'>Acciones </Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading ? (
							<SkeletonTable columns={7} />
						) : visibleRows?.length > 0 ? (
							visibleRows.map((item, index) => (
								<Row
									key={item.id}
									item={item}
									data={data}
									sortConfig={sortConfig}
									fetchData={fetchData}
									startIndex={startIndex}
									index={index}
								/>
							))
						) : (
							<Table.Row>
								<Table.Cell colSpan={7} textAlign='center' py={2}>
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

StudentTuitionTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
};
