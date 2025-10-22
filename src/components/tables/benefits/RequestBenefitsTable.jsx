import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Badge, Box, Group, HStack, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';
import { usePaginatedInfiniteData } from '@/components/navigation';
import { ReviewBenefitsModal } from '@/components/forms/benefits/ReviewBenefitsModal';
import { UpdateStatusBenefitsModal } from '@/components/forms/benefits/UpdateStatusBenefitsModal';

const Row = memo(({ item, startIndex, index, refetch, sortConfig, data }) => {
	return (
		<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
			<Table.Cell>
				{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
					? data.length - (startIndex + index)
					: startIndex + index + 1}
			</Table.Cell>
			<Table.Cell>{item.student_name}</Table.Cell>

			<Table.Cell>{item.type_display}</Table.Cell>
			<Table.Cell>
				<Badge
					colorPalette={
						item.status_review_benefit === 2
							? 'blue'
							: item.status_review_benefit === 3
								? 'red'
								: item.status_review_benefit === 4
									? 'green'
									: 'gray'
					}
					variant='subtle'
					px={2}
					py={0.5}
					borderRadius='md'
					fontSize='sm'
				>
					{item.status_review_benefit_display || 'Sin estado'}
				</Badge>
			</Table.Cell>

			<Table.Cell>
				<HStack justify='space-between'>
					<Group gap={1}>
						<ReviewBenefitsModal item={item} fetchPaymentOrders={refetch} />
						<UpdateStatusBenefitsModal data={item} fetchData={refetch} />
					</Group>
				</HStack>
			</Table.Cell>
		</Table.Row>
	);
});

Row.displayName = 'Row';

Row.propTypes = {
	item: PropTypes.object,
	refetch: PropTypes.func,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
};

export const RequestBenefitsTable = ({
	isLoading,
	totalCount,
	data,
	refetch,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
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
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='N°'
									columnKey='index'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Nombre del estudiante'
									columnKey='student_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>

							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Tipo'
									columnKey='type_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Estado de Solicitud'
									columnKey='status_review_benefit_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>

							<Table.ColumnHeader alignContent={'start'}>
								Acciones
							</Table.ColumnHeader>
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
									refetch={refetch}
									startIndex={startIndex}
									index={index}
									sortConfig={sortConfig}
									data={data}
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

RequestBenefitsTable.propTypes = {
	isLoading: PropTypes.bool,
	data: PropTypes.array,
	refetch: PropTypes.func,
	fetchNextPage: PropTypes.func,
	hasNextPage: PropTypes.bool,
	isFetchingNextPage: PropTypes.bool,
	totalCount: PropTypes.number,
};
