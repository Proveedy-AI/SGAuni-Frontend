import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Badge, Box, HStack, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';
import { ViewPaymentOrderByApplicationModal } from '@/components/forms/payment_orders';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import useSortedData from '@/utils/useSortedData';

const Row = memo(({ item, startIndex, index }) => {
	const statusDisplay = [
		{
			id: 1,
			label: 'Pendiente',
			value: 'Pending',
			bg: '#AEAEAE',
			color: '#F5F5F5',
		},
		{
			id: 2,
			label: 'Disponible',
			value: 'Available',
			bg: '#FDD9C6',
			color: '#F86A1E',
		},
		{
			id: 3,
			label: 'Verificado',
			value: 'Verified',
			bg: '#D0EDD0',
			color: '#2D9F2D',
		},
		{
			id: 4,
			label: 'Expirado',
			value: 'Expired',
			bg: '#F7CDCE',
			color: '#E0383B',
		},
	];
	return (
		<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
			<Table.Cell>{startIndex + index + 1}</Table.Cell>
			<Table.Cell>{item.due_date}</Table.Cell>
			<Table.Cell>{item.purpose || 'No hay...'}</Table.Cell>
			<Table.Cell>{item.sub_amount || 'No hay...'}</Table.Cell>
			<Table.Cell>{item.discount_value * 100 + '%' || 'No hay...'}</Table.Cell>
			<Table.Cell>{item.total_amount || 'No hay...'}</Table.Cell>
			<Table.Cell>
				<Badge
					bg={
						statusDisplay.find((status) => status.value === item.status_value)
							?.bg
					}
					color={
						statusDisplay.find((status) => status.value === item.status_value)
							?.color
					}
				>
					{statusDisplay.find((status) => status.value === item.status_value)?.label ||
						'N/A'}
				</Badge>
			</Table.Cell>
			<Table.Cell>
				<HStack justify='space-between'>
					<ViewPaymentOrderByApplicationModal item={item} />
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
	modalityRules: PropTypes.array,
};

export const PaymentOrdersByApplicationTable = ({ data }) => {
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
									label='Fecha de vencimiento'
									columnKey='due_date'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<SortableHeader
									label='Nombre de la orden de pago'
									columnKey='payment_order_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader>Sub Total</Table.ColumnHeader>
							<Table.ColumnHeader>Descuento</Table.ColumnHeader>
							<Table.ColumnHeader>Total</Table.ColumnHeader>
							<Table.ColumnHeader>Estado</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{visibleRows?.length > 0 ? (
							visibleRows?.map((item, index) => (
								<Row
									key={item.id}
									item={item}
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
				pageSize={Number(pageSize)}
				currentPage={currentPage}
				pageSizeOptions={pageSizeOptions}
				onPageChange={(page) => setCurrentPage(page)}
				onPageSizeChange={(size) => {
					setPageSize(size);
					setCurrentPage(1);
				}}
			/>
		</Box>
	);
};

PaymentOrdersByApplicationTable.propTypes = {
	data: PropTypes.array,
	fetchData: PropTypes.func,
};
