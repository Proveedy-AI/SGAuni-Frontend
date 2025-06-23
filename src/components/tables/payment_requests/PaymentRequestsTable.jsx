import PropTypes from 'prop-types';
import { memo, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Group,
  HStack,
  Input,
  Table
} from '@chakra-ui/react';
import { Pagination } from '@/components/ui'
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { GeneratePaymentOrderModal, UpdatePaymentRequestModal, ViewPaymentRequestModal } from '@/components/forms/payment_requests';
import { ReactSelect } from '@/components/select';

const Row = memo(({ item, startIndex, index, paymentOrders, fetchPaymentRequests, fetchPaymentOrders, permissions, sortConfig, data }) => {
  const filteredPaymentOrders = paymentOrders?.filter(order => order.request === item.id);

  const statusDisplay = [
    { id: 1, label: 'Pendiente', value: 'Pending', bg:'#AEAEAE', color:'#F5F5F5' },
    { id: 2, label: 'Disponible', value: 'Available', bg:'#FDD9C6', color:'#F86A1E' },
    { id: 3, label: 'Verificado', value: 'Verified', bg:'#D0EDD0', color:'#2D9F2D' },
    { id: 4, label: 'Expirado', value: 'Expired', bg:'#F7CDCE', color:'#E0383B' }
  ]

  return (
    <Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
      <Table.Cell>
				{sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
					? data.length - (startIndex + index)
					: startIndex + index + 1}
			</Table.Cell>
      <Table.Cell>{item.requested_at || 'Campo por agregar'}</Table.Cell>
      <Table.Cell>{item.purpose_display}</Table.Cell>
      <Table.Cell>{item.num_document}</Table.Cell>
      <Table.Cell>{item.payment_method_display || item.payment_method}</Table.Cell>
      <Table.Cell>
        <Badge
          bg={statusDisplay.find(status => status.id === item.status)?.bg}
          color={statusDisplay.find(status => status.id === item.status)?.color}
        >
          {statusDisplay.find(status => status.id === item.status)?.label || 'N/A'}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        <HStack justify='space-between'>
          <Group>
            {permissions?.includes('dashboard.debt.view') &&
              <ViewPaymentRequestModal item={item} />
            }
            {permissions?.includes('dashboard.debt.view') &&
              <GeneratePaymentOrderModal 
                item={item} 
                paymentOrders={filteredPaymentOrders}
                fetchPaymentRequests={fetchPaymentRequests}
                fetchPaymentOrders={fetchPaymentOrders}
              />
            }
            {permissions?.includes('dashboard.debt.view') &&
              <UpdatePaymentRequestModal item={item} fetchData={fetchPaymentOrders} />
            }
          </Group>
        </HStack>
      </Table.Cell>
    </Table.Row>
  );
});

Row.displayName = 'Row';

Row.propTypes = {
  item: PropTypes.object,
  permissions: PropTypes.array,
  startIndex: PropTypes.number,
  index: PropTypes.number,
  paymentOrders: PropTypes.array,
  fetchPaymentRequests: PropTypes.func,
  fetchPaymentOrders: PropTypes.func,
  sortConfig: PropTypes.object,
  data: PropTypes.array,
};

export const PaymentRequestsTable = ({ data, paymentOrders, fetchPaymentRequests, fetchPaymentOrders, permissions, paymentMethodOptions, documentTypeOptions, searchValue, setSearchValue, statusOptions }) => {

  const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const [sortConfig, setSortConfig] = useState(null);
  
    const sortedData = useMemo(() => {
      if (!sortConfig) return data;
  
      const sorted = [...data];
  
      if (sortConfig.key === 'index') {
        return sortConfig.direction === 'asc' ? sorted : sorted.reverse();
      }
      return sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
  
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }, [data, sortConfig]);
  
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
                <Input
                  type='date'
                  value={searchValue.due_date || ''}
                  onChange={(e) => setSearchValue({ ...searchValue, due_date: e.target.value })}
                  placeholder='Buscar por fecha de vencimiento'
                  size='sm'
                  maxWidth='150px'
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader alignContent={'start'}>
                <SortableHeader
                  label='Nombre de la orden de pago'
                  columnKey='payment_order_name'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader alignContent={'start'}>
                <SortableHeader
                  label='Documento'
                  columnKey='document_num'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
                <ReactSelect
                  options={documentTypeOptions}
                  value={searchValue.document_type}
                  onChange={(option) => setSearchValue({ ...searchValue, document_type: option })}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader alignContent={'start'}>
                <SortableHeader
                  label='Tipo de pago'
                  columnKey='payment_method_display'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
                <ReactSelect
                  options={paymentMethodOptions}
                  value={searchValue.payment_method}
                  onChange={(option) => setSearchValue({ ...searchValue, payment_method: option })}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader alignContent={'start'}>
                <SortableHeader
                  label='Estado'
                  columnKey='status_display'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
                <ReactSelect
                  options={statusOptions}
                  value={searchValue.status}
                  onChange={(option) => setSearchValue({ ...searchValue, status: option })}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader alignContent={'start'}>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleRows?.map((item, index) => (
              <Row
                key={item.id}
                item={item}
                startIndex={startIndex}
                index={index}
                permissions={permissions}
                paymentOrders={paymentOrders}
                fetchPaymentRequests={fetchPaymentRequests}
                fetchPaymentOrders={fetchPaymentOrders}
                sortConfig={sortConfig}
                data={data}
              />
            ))}
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
  )
}

PaymentRequestsTable.propTypes = {
  data: PropTypes.array,
  paymentOrders: PropTypes.array,
  fetchPaymentRequests: PropTypes.func,
  fetchPaymentOrders: PropTypes.func,
  permissions: PropTypes.array,
  paymentMethodOptions: PropTypes.array,
  documentTypeOptions: PropTypes.array,
  searchValue: PropTypes.object,
  setSearchValue: PropTypes.func,
  statusOptions: PropTypes.array,
};