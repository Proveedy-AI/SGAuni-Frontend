import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Badge, Box, Group, HStack, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { format, parseISO } from 'date-fns';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';
import { usePaginatedInfiniteData } from '@/components/navigation';
import { ApproveFractionationRequestsModal, ViewDocumentRequestModal, ViewFractionationRequestsModal } from '@/components/forms/commitment_letters';

const Row = memo(
	({ item, startIndex, index, refetch, permissions, sortConfig, data }) => {
		const statusDisplay = [
			{ id: 1, label: 'Pendiente', bg: '#AEAEAE', color: '#F5F5F5' },
			{ id: 2, label: 'Validado', bg: '#D0EDD0', color: '#2D9F2D' },
			{ id: 3, label: 'Expirado', bg: '#F7CDCE', color: '#E0383B' },
		];

    const matchStatus = statusDisplay.find((status) => status.id === item.status);

		return (
			<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
				<Table.Cell>
					{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
						? data.length - (startIndex + index)
						: startIndex + index + 1}
				</Table.Cell>
				<Table.Cell>{format(parseISO(item.request_date), 'dd/MM/yyyy')}</Table.Cell>
				<Table.Cell>{item.program_name}</Table.Cell>
				<Table.Cell>{item.document_num}</Table.Cell>
				<Table.Cell>{item.applicant_name}</Table.Cell>
				<Table.Cell>
					<Badge
						bg={matchStatus?.bg}
						color={matchStatus?.color}
					>
						{matchStatus?.label || 'N/A'}
					</Badge>
				</Table.Cell>
				<Table.Cell>
					<HStack justify='space-between'>
						<Group gap={1}>
              {permissions?.includes('commitment.letters.view') && (
                <ViewFractionationRequestsModal item={item} matchStatus={matchStatus} />
              )}
              {permissions?.includes('commitment.letters.view') && (
                <ViewDocumentRequestModal item={item} />
              )}
              {permissions?.includes('commitment.letters.approve') && (
                <ApproveFractionationRequestsModal item={item} fetchData={refetch} />
              )}
						</Group>
					</HStack>
				</Table.Cell>
			</Table.Row>
		);
	}
);

Row.displayName = 'Row';

Row.propTypes = {
	item: PropTypes.object,
	refetch: PropTypes.func,
	permissions: PropTypes.array,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
};

export const CommitmentLettersTable = ({
	isLoading,
	data,
	refetch,
	permissions,
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
									label='Fecha de vencimiento'
									columnKey='due_date'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Id de Orden'
									columnKey='id_orden'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='N° Documento'
									columnKey='document_num'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Correo'
									columnKey='email'
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
									permissions={permissions}
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
				count={data?.length}
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
	data: PropTypes.array,
	refetch: PropTypes.func,
	permissions: PropTypes.array,
  fetchNextPage: PropTypes.func,
  hasNextPage: PropTypes.bool,
  isFetchingNextPage: PropTypes.bool,
};
