//import { UpdateSettingsCountryForm } from '@/components/forms';
import { Pagination } from '@/components/ui';
import { Badge, Box, Table } from '@chakra-ui/react';

import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';

import { useNavigate } from 'react-router';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
	const navigate = useNavigate();
	const statusMap = {
		1: { label: 'Imcompleto', color: 'orange.500' },
		2: { label: 'Pendiente', color: 'orange.500' },
		3: { label: 'Aprobado', color: 'green' },
		4: { label: 'Rechazado', color: 'red' },
	};

	return (
		<Table.Row
			onClick={(e) => {
				if (e.target.closest('button') || e.target.closest('a')) return;

				EncryptedStorage.save('selectedApplicant', item);

				navigate(`/admissions/myapplicants/proccess`, {
					state: { item },
				});
			}}
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
					const status = statusMap[item.status] || {
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

export const MyApplicantsTable = ({ data, fetchData, permissions }) => {
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

							<Table.ColumnHeader>Estado</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{visibleRows?.map((item, index) => (
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
						))}
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
};
