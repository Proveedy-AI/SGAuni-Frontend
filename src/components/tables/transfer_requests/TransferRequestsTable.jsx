import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Badge, Box, Group, Table } from '@chakra-ui/react';
import { Button, Pagination } from '@/components/ui';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';
import { PreviewDocumentRequestModal } from '@/components/modals/procedures';
import { UpdateStatusRequestModal } from '@/components/modals/transfer_requests';

const Row = memo(({ item, fetchData, startIndex, index, sortConfig, data, handleClickRow }) => {
  //1: Borrador, 2: En revisión, 3: Rechazado, 4: Aprobado, 5: Completado
	const statusColor = [
		{ id: 1, bg: 'gray.200', color: 'gray.800' },
		{ id: 2, bg: 'gray.200', color: 'gray.800' },
		{ id: 3, bg: 'red.200', color: 'red.600' },
		{ id: 4, bg: 'green.200', color: 'green.600' },
		{ id: 5, bg: 'blue.200', color: 'blue.600' },
	];

  const matchStatus = statusColor.find((status) => status.id === item.status);
  return (
    <Table.Row key={item.id} bg={index % 2 === 0 ? 'gray.100' : 'white'}>
      <Table.Cell>
        {sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
          ? data.length - (startIndex + index)
          : startIndex + index + 1}
      </Table.Cell>
      <Table.Cell>{item.student_full_name}</Table.Cell>
      <Table.Cell>{item.student_code}</Table.Cell>
      <Table.Cell>{item.from_program_name}</Table.Cell>
      <Table.Cell>{item.to_program_name}</Table.Cell>
      <Table.Cell>
        <Badge bg={matchStatus?.bg} color={matchStatus?.color} textAlign='center' >
          {matchStatus?.label || item.status_display}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        <Group>
          <PreviewDocumentRequestModal documentPath={item.request_document_url} />
          <UpdateStatusRequestModal data={item} fetchData={fetchData} />
          <Button
            size="sm"
            onClick={() => handleClickRow(item.id)}
            colorScheme='blue'
            disabled={item.status !== 4}
          >
            Ir a matrícula
          </Button>
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
  handleClickRow: PropTypes.func,
};

export const TransferRequestsTable = ({
  data,
  fetchData,
  isLoading,
  handleClickRow
}) => {
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
                  label='Código'
                  columnKey='student_code'
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
            {isLoading ? (
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
                  handleClickRow={handleClickRow}
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
				count={data?.length}
				pageSize={pageSize}
				currentPage={currentPage}
				pageSizeOptions={pageSizeOptions}
				onPageChange={setCurrentPage}
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
  handleClickRow: PropTypes.func,
};

