//import { UpdateSettingsCountryForm } from '@/components/forms';
import { SignContractsForm } from '@/components/forms';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import { SortableHeader } from '@/components/ui/SortableHeader';

import { Badge, Box, HStack, Table } from '@chakra-ui/react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';

const Row = memo(({ item, fetchData, startIndex, index, sortConfig, data }) => {
	return (
		<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
			<Table.Cell>
				{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
					? data.length - (startIndex + index)
					: startIndex + index + 1}
			</Table.Cell>
			<Table.Cell>
				{format(item.submit_by_admin_at, 'dd/MM/yy hh:mm a')}{' '}
			</Table.Cell>
			<Table.Cell>{format(item.expires_at, 'dd/MM/yy')}</Table.Cell>
			<Table.Cell>
				<Badge
					bg={item.is_signed ? 'green.100' : 'red.100'}
					color={item.is_signed ? 'green.800' : 'red.800'}
					fontSize='0.8em'
				>
					{item.is_signed ? 'Firmado' : 'Sin firmar'}
				</Badge>
			</Table.Cell>
			<Table.Cell>
				{item.submit_by_teacher_at
					? format(new Date(item.submit_by_teacher_at), 'dd/MM/yy')
					: ''}
			</Table.Cell>
			<Table.Cell>
				<a
					href={item.path_contract}
					target='_blank'
					rel='noopener noreferrer'
					style={{ color: '#3182ce', textDecoration: 'underline' }}
				>
					Ver contrato
				</a>
			</Table.Cell>
			<Table.Cell>
				<HStack>
					<SignContractsForm data={item} fetchData={fetchData} />
				</HStack>
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
	sortConfig: PropTypes.object,
	data: PropTypes.array,
};

export const ContractsMyListTable = ({ data, fetchData }) => {
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
							<Table.ColumnHeader>Fecha Registro</Table.ColumnHeader>
							<Table.ColumnHeader>Expiración</Table.ColumnHeader>
							<Table.ColumnHeader>Estado</Table.ColumnHeader>
							<Table.ColumnHeader>Fecha firmado</Table.ColumnHeader>
							<Table.ColumnHeader>Contrato</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{visibleRows?.map((item, index) => (
							<Row
								key={item.id}
								item={item}
								data={data}
								sortConfig={sortConfig}
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

ContractsMyListTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	loading: PropTypes.bool,
};
