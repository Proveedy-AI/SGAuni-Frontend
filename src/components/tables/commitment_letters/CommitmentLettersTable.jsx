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
import { ApproveFractionationRequestsModal, ViewDocumentRequestModal, ViewFractionationRequestsModal } from '@/components/forms/commitment_letters';

const Row = memo(
	({ item, startIndex, index, refetch, permissions, sortConfig, data }) => {
		const statusDisplay = [
			{ id: 1, label: 'En revisión', bg: '#AEAEAE', color: '#F5F5F5' },
			{ id: 2, label: 'Aprobado', bg: '#D0EDD0', color: '#2D9F2D' },
			{ id: 3, label: 'Rechazado', bg: '#F7CDCE', color: '#E0383B' },
		];

    /*
    {
        id: 1,
        enrollment: 1,
        enrollment_name: '2024-I',
        plan_type_display: 'Cuotas',
        total_amount: '1200.00',
        total_amortization: '400.00',
        total_balance: '800.00',
        upfront_percentage: '33%',
        number_of_installments: 3,
        approved_by: 2,
        approved_at: '2024-05-10T10:00:00.000Z',
        payment_document_type: 1,
        payment_document_type_display: 'Boleta',
        path_commitment_letter: 'https://example.com/doc/54asd6s4asdas4d89asd4as',
        num_document_person: '12345678',
        status_review: 1
      },
    */

    const matchStatus = statusDisplay.find((status) => status.id === item.status_review);

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
