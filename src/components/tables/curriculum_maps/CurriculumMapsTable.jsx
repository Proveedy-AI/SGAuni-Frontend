import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Badge, Box, Group, HStack, Table } from '@chakra-ui/react';
import { Pagination } from '@/components/ui';
import useSortedData from '@/utils/useSortedData';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { AddCoursesToCurriculumMap, PreviewCurriculumMap } from '@/components/forms/management/programs/curriculum_maps';

const Row = memo(
  ({
    item,
    /*fetchData,*/
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
        <Table.Cell>{item.code}</Table.Cell>
        <Table.Cell>{item.year}</Table.Cell>
        <Table.Cell>{item.total_courses}</Table.Cell>
        <Table.Cell textAlign="center">
          <Badge bg={item.is_current ? 'green.200' : 'red.200'} color={item.is_current ? 'green.500' : 'red.500'}>
            {item.is_current ? 'Si' : 'No'}
          </Badge>
        </Table.Cell>
        <Table.Cell>
          <HStack justify='space-between'>
            <Group>
              <PreviewCurriculumMap item={item} />
              <AddCoursesToCurriculumMap item={item} />
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
  program: PropTypes.object,
  fetchData: PropTypes.func,
  startIndex: PropTypes.number,
  index: PropTypes.number,
  sortConfig: PropTypes.object,
  data: PropTypes.array,
};

export const CurriculumMapsTable = ({
  data,
  fetchData,
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
              <Table.ColumnHeader w='30%'>
                <SortableHeader
                  label='Código'
                  columnKey='code'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='10%'>
                <SortableHeader
                  label='Año'
                  columnKey='year'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='10%'>
                <SortableHeader
                  label='Cursos'
                  columnKey='total_courses'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='10%'>
                <SortableHeader
                  label='Actual'
                  columnKey='is_current'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='40%'>Acciones</Table.ColumnHeader>
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
                  fetchData={fetchData}
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

CurriculumMapsTable.propTypes = {
  data: PropTypes.array,
  fetchData: PropTypes.func,
  isLoading: PropTypes.bool,
};
