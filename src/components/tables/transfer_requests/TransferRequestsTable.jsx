import PropTypes from 'prop-types';
import { memo, useEffect, useState } from 'react';
import { Badge, Box, Group, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';
import { usePaginatedInfiniteData } from '@/components/navigation';
import { PreviewDocumentRequestModal } from '@/components/modals/procedures';
import { UpdateStatusRequestModal } from '@/components/modals/transfer_requests';

const Row = memo(({ item, startIndex, index, sortConfig, data }) => {
  const statusDisplay = [
    { id: 1, label: 'En revisión', bg: 'gray.200', color: 'black' },
    { id: 2, label: 'Aprobado', bg: 'green.200', color: 'green.700' },
    { id: 3, label: 'Rechazado', bg: 'red.200', color: 'red.700' },
  ];

  const matchStatus = statusDisplay.find((status) => status.id === item.status);
  return (
    <Table.Row key={item.id} bg={index % 2 === 0 ? 'gray.100' : 'white'}>
      <Table.Cell>
        {sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
          ? data.length - (startIndex + index)
          : startIndex + index + 1}
      </Table.Cell>
      <Table.Cell>{item.student_name}</Table.Cell>
      <Table.Cell>{item.document_number}</Table.Cell>
      <Table.Cell>{item.program_name_from}</Table.Cell>
      <Table.Cell>{item.program_name_to}</Table.Cell>
      <Table.Cell>
        <Badge bg={matchStatus?.bg} color={matchStatus?.color} textAlign='center' >
          {matchStatus?.label || item.status_display}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        <Group>
          <PreviewDocumentRequestModal documentPath={item.document_path} />
          <UpdateStatusRequestModal data={item} fetchData={() => {}} />
        </Group>
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
  sortConfig: PropTypes.object,
  data: PropTypes.array,
};

export const TransferRequestsTable = ({
  data,
  fetchData,
  isLoading,
  totalCount,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  resetPageTrigger,
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

  useEffect(() => {
    setCurrentPage(1);
  }, [resetPageTrigger]);

  return (
    <Box
      bg={{ base: 'white', _dark: 'its.gray.500' }}
      p='3'
      borderRadius='10px'
      overflow='hidden'
      boxShadow='md'
    >
      <Table.ScrollArea>
        <Table.Root size='sm' w='full'>
          <Table.Header>
            <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
              <Table.ColumnHeader w='5%'>
                <SortableHeader
                  label='N°'
                  columnKey='index'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='20%'>
                <SortableHeader
                  label='Estudiante'
                  columnKey='student_full_name'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='15%'>
                <SortableHeader
                  label='N° Documento'
                  columnKey='document_number'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='15%'>
                <SortableHeader
                  label='Programa procedente'
                  columnKey='program_name_from'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='15%'>
                <SortableHeader
                  label='Programa destino'
                  columnKey='program_name_to'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='15%'>
                <SortableHeader
                  label='Estado'
                  columnKey='status_display'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='10%'>
                <SortableHeader
                  label='Acciones'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading || (isFetchingNextPage && hasNextPage) ? (
              <SkeletonTable columns={7} />
            ) : visibleRows?.length > 0 ? (
              visibleRows.map((item, index) => (
                <Row
                  key={item.id}
                  item={item}
                  data={data}
                  sortConfig={sortConfig}
                  fetchData={fetchData}
                  startIndex={startIndex}
                  index={index}
                />
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={7} textAlign='center' py={2}>
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

TransferRequestsTable.propTypes = {
  data: PropTypes.array,
  fetchData: PropTypes.func,
  isLoading: PropTypes.bool,
  fetchNextPage: PropTypes.func,
  hasNextPage: PropTypes.bool,
  isFetchingNextPage: PropTypes.bool,
  resetPageTrigger: PropTypes.func,
  totalCount: PropTypes.number,
};

