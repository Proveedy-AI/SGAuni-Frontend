//import { UpdateSettingsCountryForm } from '@/components/forms';
import { SignContractsForm } from '@/components/forms';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import { formatDateString } from '@/components/ui/dateHelpers';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import useSortedData from '@/utils/useSortedData';

import { Badge, Box, HStack, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';

const Row = memo(({ item, fetchData, startIndex, index, sortConfig, data }) => {
	return (
		<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
			<Table.Cell>
				{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
					? data.length - (startIndex + index)
					: startIndex + index + 1}
			</Table.Cell>
			<Table.Cell>{formatDateString(item.submit_by_admin_at)} </Table.Cell>
			<Table.Cell>{formatDateString(item.expires_at)}</Table.Cell>
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
					? formatDateString(item.submit_by_teacher_at)
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

export const ContractsMyListTable = ({ data, fetchData, isLoading }) => {
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
				<Table.Root size='sm' w='full' striped>
					<Table.Header>
						<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
							<Table.ColumnHeader w={'5%'}>
								<SortableHeader
									label='N°'
									columnKey='index'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Fecha de registro'
									columnKey='submit_by_admin_at'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Expiración'
									columnKey='expires_at'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Estado'
									columnKey='is_signed'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Fecha Firmada'
									columnKey='submit_by_teacher_at'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>Contrato</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
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

ContractsMyListTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
};
