import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Badge, Box, HStack, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';

import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';
import {
	ViewFractionationRequestsModal,
	ViewInstallmentsFractionationModal,
} from '@/components/forms/commitment_letters';

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
	const statusDisplay = [
		{ id: 1, label: 'Borrador', bg: '#AEAEAE', color: '#F5F5F5' },
		{ id: 2, label: 'En revisión', bg: '#d0daedff', color: '#2d689fff' },
		{ id: 3, label: 'Rechazado', bg: '#F7CDCE', color: '#E0383B' },
		{ id: 4, label: 'Aprobado', bg: '#D0EDD0', color: '#2D9F2D' },
	];

	const matchStatus = statusDisplay.find(
		(status) => status.id === item.status_review
	);

	return (
		<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
			<Table.Cell>
				{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
					? data.length - (startIndex + index)
					: startIndex + index + 1}
			</Table.Cell>

			<Table.Cell>{item.enrollment_name}</Table.Cell>
			<Table.Cell>{item.plan_type_display}</Table.Cell>
			<Table.Cell>{item.upfront_percentage * 100}</Table.Cell>
			<Table.Cell>{item.number_of_installments}</Table.Cell>
			<Table.Cell>
				<Badge bg={matchStatus?.bg} color={matchStatus?.color}>
					{matchStatus?.label || 'N/A'}
				</Badge>
			</Table.Cell>
			<Table.Cell>
				<HStack>
					<ViewInstallmentsFractionationModal
						item={item}
						matchStatus={matchStatus}
					/>
				</HStack>
			</Table.Cell>
			<Table.Cell>
				<ViewFractionationRequestsModal item={item} matchStatus={matchStatus} />
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

export const MyFractionationTable = ({ data, fetchData, isLoading }) => {
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
							<Table.ColumnHeader w='5%'>
								<SortableHeader
									label='N°'
									columnKey='index'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>

							<Table.ColumnHeader w='25%'>
								<SortableHeader
									label='Matrícula'
									columnKey='enrollment_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='15%'>
								<SortableHeader
									label='Tipo'
									columnKey='plan_type_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='15%'>
								<SortableHeader
									label='Min. Adelanto %'
									columnKey='upfront_percentage'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='15%'>
								<SortableHeader
									label='N° Cuotas'
									columnKey='number_of_installments'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='15%'>
								<SortableHeader
									label='Estado'
									columnKey='status_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='15%'>Cuotas</Table.ColumnHeader>
							<Table.ColumnHeader w='10%'>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading ? (
							<SkeletonTable columns={8} />
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

MyFractionationTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
	fetchNextPage: PropTypes.func,
	hasNextPage: PropTypes.bool,
	isFetchingNextPage: PropTypes.bool,
	resetPageTrigger: PropTypes.func,
};
