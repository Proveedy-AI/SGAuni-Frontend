import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import {
  Box,
  Group,
  HStack,
  Table,
} from '@chakra-ui/react';
import { Pagination } from '@/components/ui';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';
import { EditCourseModal, ViewCourseModal } from '@/components/forms/courses';

const Row = memo(
  ({
    item,
    fetchData,
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
        <Table.Cell>{item.name}</Table.Cell>
        <Table.Cell textAlign='center'>{item.credits}</Table.Cell>
        <Table.Cell textAlign='center'>{item.type}</Table.Cell>
        <Table.Cell>{item.pre_requisite || '-'}</Table.Cell>
        <Table.Cell>
          <HStack justify='space-between'>
            <Group>
              <ViewCourseModal item={item} />
              <EditCourseModal data={data} item={item} fetchData={fetchData} />
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
  fetchData: PropTypes.func,
  startIndex: PropTypes.number,
  index: PropTypes.number,
  sortConfig: PropTypes.object,
  data: PropTypes.array,
};

export const CoursesTable = ({
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
      boxShadow='md'
    >
      <Table.ScrollArea>
        <Table.Root size='sm' w='full' striped>
          <Table.Header>
            <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
              <Table.ColumnHeader w='10%'>
                <SortableHeader
									label='N°'
									columnKey='index'
									sortConfig={sortConfig}
									onSort={setSortConfig}
								/>
              </Table.ColumnHeader>
              <Table.ColumnHeader w='10%'>
                <SortableHeader
                  label='Código'
                  columnKey='code'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='25%'>
                <SortableHeader
                  label='Nombre'
                  columnKey='name'
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
              <Table.ColumnHeader w='10%'>
                <SortableHeader
                  label='Tipo'
                  columnKey='type'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='50%'>
                <SortableHeader
                  label='Pre requisitos'
                  columnKey='prerequisite'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <SkeletonTable columns={3} />
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
                <Table.Cell colSpan={3} textAlign='center' py={2}>
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

CoursesTable.propTypes = {
  data: PropTypes.array,
  fetchData: PropTypes.func,
  isLoading: PropTypes.bool,
};
