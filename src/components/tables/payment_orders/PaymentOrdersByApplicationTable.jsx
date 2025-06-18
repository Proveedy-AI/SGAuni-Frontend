import PropTypes from 'prop-types';
import { memo, useMemo, useState } from "react";
import {
  Box,
  HStack,
  Table
} from '@chakra-ui/react';
import { Pagination } from '@/components/ui'
import { ViewPaymentOrderByApplicationModal } from '@/components/forms/payment_orders';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';

const Row = memo(({ item, startIndex, index }) => {

  return (
    <Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
      <Table.Cell>{startIndex + index + 1}</Table.Cell>
      <Table.Cell>{item.due_date}</Table.Cell>
      <Table.Cell>{item.payment_order_name || 'No hay...'}</Table.Cell>
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
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleRows?.map((item, index) => (
              <Row
                key={item.id}
                item={item}
                startIndex={startIndex}
                index={index}
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

PaymentOrdersByApplicationTable.propTypes = {
  data: PropTypes.array,
  fetchData: PropTypes.func,
};