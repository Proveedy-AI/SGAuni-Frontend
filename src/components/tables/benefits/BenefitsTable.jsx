import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Badge, Box, Group, HStack, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import {
	ValidatePaymentOrderModal,
	ViewPaymentOrderVoucherModal,
} from '@/components/forms/payment_orders';
import { format, parseISO } from 'date-fns';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';
import { usePaginatedInfiniteData } from '@/components/navigation';

const Row = memo(({ item, startIndex, index, refetch, sortConfig, data }) => {
	const statusDisplay = [
		{ id: 1, label: 'Pendiente', bg: '#AEAEAE', color: '#F5F5F5' },
		{ id: 2, label: 'Generado', bg: '#C6E7FC', color: '#0661D8' },
		{ id: 3, label: 'Verificado', bg: '#D0EDD0', color: '#2D9F2D' },
		{ id: 4, label: 'Expirado', bg: '#F7CDCE', color: '#E0383B' },
		{ id: 5, label: 'Cancelado', bg: '#F0E0E0', color: '#B0B0B0' },
	];

	const selectedStatus = statusDisplay.find(
		(status) => status.id === item.status
	);
	return (
		<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
			<Table.Cell>
				{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
					? data.length - (startIndex + index)
					: startIndex + index + 1}
			</Table.Cell>
			<Table.Cell>{format(parseISO(item.due_date), 'dd/MM/yyyy')}</Table.Cell>
			<Table.Cell>{item.id_orden}</Table.Cell>
			<Table.Cell>{item.document_num}</Table.Cell>
			<Table.Cell>{item.email}</Table.Cell>
			<Table.Cell>{item.total_amount}</Table.Cell>
			<Table.Cell>
				<Badge bg={selectedStatus?.bg} color={selectedStatus?.color}>
					{selectedStatus?.label || 'N/A'}
				</Badge>
			</Table.Cell>
			<Table.Cell>
				<HStack justify='space-between'>
					<Group gap={1}>
						<ViewPaymentOrderVoucherModal
							item={item}
							fetchPaymentOrders={refetch}
						/>

						<ValidatePaymentOrderModal
							item={item}
							fetchPaymentOrders={refetch}
						/>
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

export const BenefitsTable = ({
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
									columnKey='student_full_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Programa'
									columnKey='enrollment_period_program'
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
									columnKey='status_benefit_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Monto Total'
									columnKey='total_amount'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Estado'
									columnKey='status_display'
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

BenefitsTable.propTypes = {
	isLoading: PropTypes.bool,
	data: PropTypes.array,
	refetch: PropTypes.func,
	fetchNextPage: PropTypes.func,
	hasNextPage: PropTypes.bool,
	isFetchingNextPage: PropTypes.bool,
	totalCount: PropTypes.number,
};
