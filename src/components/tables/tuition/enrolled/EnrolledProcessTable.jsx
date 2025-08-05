import PropTypes from 'prop-types';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { Box, Table } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import useSortedData from '@/utils/useSortedData';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { formatDateString } from '@/components/ui/dateHelpers';

const Row = memo(({ item, startIndex, index, sortConfig, data, permissions }) => {
  const navigate = useNavigate();
  const encrypted = Encryptor.encrypt(item.id);
  const encoded = encodeURIComponent(encrypted);

  const handleRowClick = () => {
    if (permissions.includes('enrollments.enrolled.view')) {
      navigate(`/enrollments/programs/${encoded}/course-groups`);
    }
  };

  return (
    <Table.Row
      onClick={handleRowClick}
      key={item.id}
      bg={index % 2 === 0 ? 'gray.100' : 'white'}
      _hover={{
        bg: 'blue.100',
        cursor: 'pointer',
      }}
    >
      <Table.Cell>
        {sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
          ? data.length - (startIndex + index)
          : startIndex + index + 1}
      </Table.Cell>
      <Table.Cell>{item.academic_period_name}</Table.Cell>
      <Table.Cell>{formatDateString(item.start_date)}</Table.Cell>
      <Table.Cell>{formatDateString(item.end_date)}</Table.Cell>
    </Table.Row>
  );
});

Row.displayName = 'EnrolledProcessRow';

Row.propTypes = {
  item: PropTypes.object.isRequired,
  startIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  sortConfig: PropTypes.object,
  data: PropTypes.array.isRequired,
  permissions: PropTypes.array,
};

export const EnrolledProcessTable = ({ data, permissions, isLoading }) => {
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
              <Table.ColumnHeader minW={'200px'}>
                <SortableHeader
                  label='Período Académico'
                  columnKey='academic_period_name'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader minW={'200px'}>
                <SortableHeader
                  label='Fecha Inicio'
                  columnKey='start_date'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader minW={'200px'}>
                <SortableHeader
                  label='Fecha Fin'
                  columnKey='end_date'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <SkeletonTable columns={5} />
            ) : visibleRows?.length > 0 ? (
              visibleRows.map((item, index) => (
                <Row
                  key={item.id}
                  item={item}
                  data={data}
                  sortConfig={sortConfig}
                  startIndex={startIndex}
                  index={index}
                  permissions={permissions}
                />
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={5} textAlign='center' py={2}>
                  No hay procesos de matrícula disponibles.
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

EnrolledProcessTable.propTypes = {
  data: PropTypes.array,
  permissions: PropTypes.array,
  isLoading: PropTypes.bool,
};

