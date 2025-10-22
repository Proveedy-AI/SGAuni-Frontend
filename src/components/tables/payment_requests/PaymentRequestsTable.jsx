import PropTypes from 'prop-types';
import { memo, useRef, useState } from 'react';
import { Badge, Box, Group, HStack, IconButton, Table, Text } from '@chakra-ui/react';
import { Modal, Pagination, toaster } from '@/components/ui';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
//import { useNavigate } from 'react-router';
//import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { format, parseISO } from 'date-fns';
import {
	GeneratePaymentOrderModalByRequest,
	ViewPaymentRequestModal,
} from '@/components/forms/payment_requests';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { usePaginatedInfiniteData } from '@/components/navigation';
import useSortedData from '@/utils/useSortedData';
import { FaTimes } from 'react-icons/fa';
import { useUpdatePaymentRequest } from '@/hooks/payment_requests';

const Row = memo(
	({ item, startIndex, index, permissions, sortConfig, data, fetchData, statusOptions }) => {
    const contentRef = useRef();
    const [open, setOpen] = useState(false);
    const { mutate: update, isPending: loadingUpdate } = useUpdatePaymentRequest();

    const handleUpdate = () => {
      const payload = {
        status: 5
      }

      update({id: item?.id, payload}, {
        onSuccess: () => {
          toaster.create({
            title: 'Estado de solicitud actualizada',
            type: 'success'
          })
          setOpen(false);
          fetchData();
        },
        onError: () => {
          toaster.create({
            title: 'Hubo un error al cambiar estado de solicitud',
            type: 'error',
          })
        }
      })
    }
    

		return (
			<Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
				<Table.Cell>
					{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
						? data.length - (startIndex + index)
						: startIndex + index + 1}
				</Table.Cell>
				<Table.Cell>
					{format(parseISO(item.requested_at), 'dd/MM/yyyy')}
				</Table.Cell>
				<Table.Cell>{item.person_fullname}</Table.Cell>
				<Table.Cell>{item.person_personal_email}</Table.Cell>
				<Table.Cell>{item.amount}</Table.Cell>
				<Table.Cell>{item.purpose_display}</Table.Cell>
				<Table.Cell>{item.num_document}</Table.Cell>
				<Table.Cell>{item.payment_method_display}</Table.Cell>
				<Table.Cell>{item.program_name}</Table.Cell>
				<Table.Cell>
					{item.admission_process_name || item.enrollment_process_name}
				</Table.Cell>
				<Table.Cell textAlign='center'>
					<Badge
						colorPalette={
							statusOptions.find((status) => status.id === item.status)?.bg
						}
					>
						{statusOptions.find((status) => status.id === item.status)?.label ||
							'N/A'}
					</Badge>
				</Table.Cell>
				<Table.Cell>
					<HStack justify='space-between'>
						<Group>
							{permissions.includes('payment.requests.view') && (
								<ViewPaymentRequestModal item={item} />
							)}
							{permissions.includes('payment.orders.generate') && (
								<GeneratePaymentOrderModalByRequest
									fetchData={fetchData}
									item={item}
									permissions={permissions}
								/>
							)}
              {permissions.includes('payment.requests.view') && (
                <Modal
                  title='Cambiar estado de solicitud'
                  placement='center'
                  trigger={
                    <IconButton size='xs' bg="red.500">
                      <FaTimes />
                    </IconButton>
                  }
                  size='xl'
                  onSave={handleUpdate}
                  saveLabel="Aceptar"
                  loading={loadingUpdate}
                  open={open}
                  onOpenChange={(e) => setOpen(e.open)}
                  contentRef={contentRef}
                >
                  <Text>¿Estás seguro de que desea cancelar el estado de esta solicitud?</Text>
                </Modal>
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
	permissions: PropTypes.array,
	startIndex: PropTypes.number,
	index: PropTypes.number,
	sortConfig: PropTypes.object,
	data: PropTypes.array,
	fetchData: PropTypes.func,
  statusOptions: PropTypes.array
};

export const PaymentRequestsTable = ({
	isLoading,
	data,
	permissions,
	fetchData,
	isFetchingNextPage,
	totalCount,
	fetchNextPage,
	hasNextPage,
  statusOptions
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
									label='Fecha de Solicitud'
									columnKey='requested_at'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Nombre completo'
									columnKey='full_name'
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
									label='Monto (S/.)'
									columnKey='amount'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Concepto de pago'
									columnKey='purpose_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Documento'
									columnKey='num_document'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Tipo de pago'
									columnKey='payment_method_display'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Programa'
									columnKey='admission_process_program_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader alignContent={'start'}>
								<SortableHeader
									label='Proceso'
									columnKey='admission_process_name'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
							</Table.ColumnHeader>
							<Table.ColumnHeader width='120px' alignContent={'start'}>
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
							<SkeletonTable columns={12} />
						) : visibleRows?.length > 0 ? (
							visibleRows?.map((item, index) => (
								<Row
									key={item.id}
									item={item}
									startIndex={startIndex}
									fetchData={fetchData}
									index={index}
									permissions={permissions}
									sortConfig={sortConfig}
									data={data}
                  statusOptions={statusOptions}
								/>
							))
						) : (
							<Table.Row>
								<Table.Cell colSpan={12} textAlign='center' py={2}>
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

PaymentRequestsTable.propTypes = {
	isLoading: PropTypes.bool,
	data: PropTypes.array,
	permissions: PropTypes.array,
	isFetchingNextPage: PropTypes.bool,
	totalCount: PropTypes.number,
	fetchNextPage: PropTypes.func,
	hasNextPage: PropTypes.bool,
	fetchData: PropTypes.func,
  statusOptions: PropTypes.array
};
