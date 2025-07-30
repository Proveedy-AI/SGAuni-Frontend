import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Badge, Box, Group, HStack, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
//import { format, parseISO } from 'date-fns';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';
import { usePaginatedInfiniteData } from '@/components/navigation';
import {
	ViewDocumentRequestModal,
	ViewFractionationRequestsModal,
} from '@/components/forms/commitment_letters';
import { UpdateStatusFractionatopmModal } from '@/components/forms/commitment_letters/UpdateStatusFractionatopmModal';

const Row = memo(({ item, startIndex, index, refetch, sortConfig, data }) => {
	const statusDisplay = [
		{ id: 1, label: 'Borrador', bg: '#AEAEAE', color: '#F5F5F5' },
		{ id: 2, label: 'En revisión', bg: '#d0daedff', color: '#2d689fff' },
		{ id: 3, label: 'Rechazado', bg: '#F7CDCE', color: '#E0383B' },
		{ id: 4, label: 'Aprobado', bg: '#D0EDD0', color: '#2D9F2D' },
	];

	const matchStatus = statusDisplay.find((status) => status.id === item.status);

	return (
		<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
			<Table.Cell>
				{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
					? data.length - (startIndex + index)
					: startIndex + index + 1}
			</Table.Cell>
			<Table.Cell>{item.enrollment_name}</Table.Cell>
			<Table.Cell>{item.num_document_person}</Table.Cell>
			<Table.Cell>{item.number_of_installments}</Table.Cell>
			<Table.Cell>{item.payment_document_type_display}</Table.Cell>
			<Table.Cell>
				<Badge bg={matchStatus?.bg} color={matchStatus?.color}>
					{matchStatus?.label || 'N/A'}
				</Badge>
			</Table.Cell>
			<Table.Cell>
				<HStack justify='space-between'>
					<Group gap={1}>
						<ViewFractionationRequestsModal
							item={item}
							matchStatus={matchStatus}
						/>

						<ViewDocumentRequestModal item={item} />

						<UpdateStatusFractionatopmModal data={item} fetchData={refetch} />
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

export const CommitmentLettersTable = ({
	isLoading,
	data,
	totalCount,
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
									label='Matrícula'
									columnKey='enrollment_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='N° Documento'
									columnKey='num_document_person'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='N° Cuotas'
									columnKey='number_of_installments'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Recibo'
									columnKey='payment_document_type_display'
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
							<SkeletonTable columns={7} />
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

CommitmentLettersTable.propTypes = {
	isLoading: PropTypes.bool,
	totalCount: PropTypes.number,
	data: PropTypes.array,
	refetch: PropTypes.func,
	fetchNextPage: PropTypes.func,
	hasNextPage: PropTypes.bool,
	isFetchingNextPage: PropTypes.bool,
};
