import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { Box, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
	return (
		<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
			<Table.Cell>
				{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
					? data.length - (startIndex + index)
					: startIndex + index + 1}
			</Table.Cell>
			<Table.Cell>{item.program_name}</Table.Cell>
			<Table.Cell>{item.program_type}</Table.Cell>
			<Table.Cell>{item.reviewed_by}</Table.Cell>
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
	permissions: PropTypes.array,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
};

export const AdmissionsProgramsAproveeTable = ({
	data,
	fetchData,
	permissions,
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
				<Table.Root size='sm' w='full' striped>
					<Table.Header>
						<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
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
									label='Programa'
									columnKey='program_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Tipo'
									columnKey='program_type'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Revisado por'
									columnKey='reviewed_by'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>Fecha de Aprobación</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{visibleRows?.length > 0 ? (
							visibleRows.map((item, index) => (
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
								<Table.Cell colSpan={7} textAlign='center'>
									Sin datos disponibles
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

AdmissionsProgramsAproveeTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	loading: PropTypes.bool,
	permissions: PropTypes.array,
};
