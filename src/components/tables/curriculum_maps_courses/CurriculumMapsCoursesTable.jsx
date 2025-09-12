import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Badge, Box, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';
import useSortedData from '@/utils/useSortedData';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import SkeletonTable from '@/components/ui/SkeletonTable';

const Row = memo(
  ({
    item,
    startIndex,
    index,
    sortConfig,
    data,
  }) => {
    return (
      <Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
        <Table.Cell>
          {sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
            ? data.length - (startIndex + index)
            : startIndex + index + 1}
        </Table.Cell>
        <Table.Cell>{item.course_code}</Table.Cell>
        <Table.Cell>{item.course_name}</Table.Cell>
        <Table.Cell>{item.cycle}</Table.Cell>
        <Table.Cell>{item.credits}</Table.Cell>
        <Table.Cell textAlign="center">
          <Badge bg={item.credits ? 'green.200' : 'red.200'} color={item.credits ? 'green.500' : 'red.500'}>
            {item.credits ? 'Si' : 'No'}
          </Badge>
        </Table.Cell>
      </Table.Row>
    );
  }
);

Row.displayName = 'Row';

Row.propTypes = {
  item: PropTypes.object,
  program: PropTypes.object,
  startIndex: PropTypes.number,
  index: PropTypes.number,
  sortConfig: PropTypes.object,
  data: PropTypes.array,
};

export const CurriculumMapsCoursesTable = ({
  data,
  isLoading,
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
      boxShadow='sm'
    >
      <Table.ScrollArea>
        <Table.Root size='sm' w='full' striped>
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
              <Table.ColumnHeader w='35%'>
                <SortableHeader
                  label='Código'
                  columnKey='course_code'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='35%'>
                <SortableHeader
                  label='Nombre'
                  columnKey='course_name'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='10%'>
                <SortableHeader
                  label='Ciclo'
                  columnKey='cycle'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='10%'>
                <SortableHeader
                  label='Créditos'
                  columnKey='credits'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='5%' textAlign="center">Obligatorio</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <SkeletonTable columns={6} />
            ) : visibleRows?.length > 0 ? (
              visibleRows.map((item, index) => (
                <Row
                  key={item.id}
                  item={item}
                  data={data}
                  sortConfig={sortConfig}
                  startIndex={startIndex}
                  index={index}
                />
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6} textAlign='center' py={2}>
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

CurriculumMapsCoursesTable.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
};
