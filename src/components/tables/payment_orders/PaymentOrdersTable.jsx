import PropTypes from 'prop-types';
import { memo, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Group,
  HStack,
  Table
} from '@chakra-ui/react';
import { Pagination } from '@/components/ui'
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { ValidatePaymentOrderModal, ViewPaymentOrderVoucherModal } from '@/components/forms/payment_orders';
import { format, parseISO } from 'date-fns';
import SkeletonTable from '@/components/ui/SkeletonTable';

const Row = memo(({ item, startIndex, index, refetch, permissions, sortConfig, data }) => {
  const statusDisplay = [
    { id: 1, label: 'Pendiente', bg:'#AEAEAE', color:'#F5F5F5' },
    { id: 2, label: 'Generado', bg:'#C6E7FC', color:'#0661D8' },
    { id: 3, label: 'Verificado', bg:'#D0EDD0', color:'#2D9F2D' },
    { id: 4, label: 'Expirado', bg:'#F7CDCE', color:'#E0383B' },
  ]

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
        <Badge
          bg={statusDisplay.find(status => status.id === item.status)?.bg}
          color={statusDisplay.find(status => status.id === item.status)?.color}
        >
          {statusDisplay.find(status => status.id === item.status)?.label || 'N/A'}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        <HStack justify='space-between'>
          <Group gap={1}>
            {permissions.includes('payment.vouchers.view') && (
              <ViewPaymentOrderVoucherModal item={item} fetchPaymentOrders={refetch} />
            )}
            {permissions.includes('payment.orders.validate') && ( 
              <ValidatePaymentOrderModal item={item} fetchPaymentOrders={refetch}  />
            )}
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
  permissions: PropTypes.array,
  startIndex: PropTypes.number,
  index: PropTypes.number,
  sortConfig: PropTypes.object,
  data: PropTypes.array,
};

export const PaymentOrdersTable = ({ isLoading, data, refetch, permissions }) => {

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
              <Table.ColumnHeader alignContent={'start'}>Acciones</Table.ColumnHeader>
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

PaymentOrdersTable.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  refetch: PropTypes.func,
  permissions: PropTypes.array,
};