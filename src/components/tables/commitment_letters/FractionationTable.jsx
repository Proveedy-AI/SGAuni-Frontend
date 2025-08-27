import PropTypes from 'prop-types';
import { memo, useEffect, useState } from 'react';
import { Badge, Box, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';

import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';
import { usePaginatedInfiniteData } from '@/components/navigation';
import { ViewFractionationRequestsModal } from '@/components/forms/commitment_letters';

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
	const statusDisplay = [
		{ id: 1, label: 'En revisión', color: 'blue' },
		{ id: 2, label: 'Rechazado', color: 'red' },
		{ id: 3, label: 'Aprobado', color: 'green' },
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
			<Table.Cell>{item.student_name}</Table.Cell>
			<Table.Cell>{item.enrollment_name}</Table.Cell>
			<Table.Cell>{item.payment_document_type_display}</Table.Cell>
			<Table.Cell>{item.upfront_percentage * 100}%</Table.Cell>
			<Table.Cell>
				<Badge colorPalette={matchStatus?.color}>
					{matchStatus?.label || 'N/A'}
				</Badge>
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

export const FractionationTable = ({
	data,
	fetchData,
	isLoading,
	isFetchingNextPage,
	totalCount,
	fetchNextPage,
	hasNextPage,
	resetPageTrigger,
}) => {
	const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
	const [sortConfig, setSortConfig] = useState(null);

	const sortedData = useSortedData(data, sortConfig);

	const {
		currentPage,
		startIndex,
		visibleRows,
		loadUntilPage,
		setCurrentPage,
	} = usePaginatedInfiniteData({
		data: sortedData,
		pageSize,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	});

	useEffect(() => {
		setCurrentPage(1);
	}, [resetPageTrigger]);
	const validRows = visibleRows?.filter((item) => item && item.id) ?? [];
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
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Estudiante'
									columnKey='student_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Matrícula'
									columnKey='enrollment_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Tipo'
									columnKey='payment_document_type_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader w='20%'>
								<SortableHeader
									label='Min. Adelanto %'
									columnKey='upfront_percentage'
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
							<Table.ColumnHeader w='10%'>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading || (isFetchingNextPage && hasNextPage) ? (
							<SkeletonTable columns={6} />
						) : validRows?.length > 0 ? (
							validRows.map((item, index) => (
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
								<Table.Cell colSpan={6} textAlign='center' py={2}>
									No hay datos disponibles.
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Root>
			</Table.ScrollArea>

			<Pagination
				count={totalCount}
				pageSize={pageSize}
				currentPage={currentPage}
				pageSizeOptions={pageSizeOptions}
				onPageChange={loadUntilPage}
				onPageSizeChange={(size) => {
					setPageSize(size);
					setCurrentPage(1);
				}}
			/>
		</Box>
	);
};

FractionationTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
	totalCount: PropTypes.number,
	fetchNextPage: PropTypes.func,
	hasNextPage: PropTypes.bool,
	isFetchingNextPage: PropTypes.bool,
	resetPageTrigger: PropTypes.func,
};
