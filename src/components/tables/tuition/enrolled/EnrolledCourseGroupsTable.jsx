import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';
import useSortedData from '@/utils/useSortedData';
import { Box, Table, Badge } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

const Row = memo(({ item, startIndex, index, sortConfig, data, permissions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const encrypted = Encryptor.encrypt(item.id);
  const encoded = encodeURIComponent(encrypted);
  
  const handleRowClick = () => {
    if (permissions?.includes('enrollments.enrolled.view')) {
      navigate(`${location.pathname}/${encoded}`);
    }
  };

  return (
    <Table.Row
      onClick={(e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        if (permissions?.includes('enrollments.enrolled.view')) {
          handleRowClick();
        }
      }}
      key={item.id}
      bg={index % 2 === 0 ? 'gray.100' : 'white'}
      _hover={{
        bg: permissions?.includes('enrollments.enrolled.view') ? 'blue.100' : 'gray.200',
        cursor: permissions?.includes('enrollments.enrolled.view') ? 'pointer' : 'default',
      }}
    >
      <Table.Cell>
        {sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
          ? data.length - (startIndex + index)
          : startIndex + index + 1}
      </Table.Cell>
      <Table.Cell fontWeight="medium">{item.course_code}</Table.Cell>
      <Table.Cell>{item.course_name}</Table.Cell>
      <Table.Cell textAlign="center">{item.cycle}</Table.Cell>
      <Table.Cell textAlign="center">{item.credits}</Table.Cell>
      <Table.Cell textAlign="center">
        <Badge
          px={2}
          py={1}
          borderRadius="md"
          fontWeight="bold"
          bg={item.is_mandatory ? 'red.100' : 'blue.100'}
          color={item.is_mandatory ? 'red.800' : 'blue.800'}
        >
          {item.is_mandatory ? 'Obligatorio' : 'Electivo'}
        </Badge>
      </Table.Cell>
    </Table.Row>
  );
});

Row.displayName = 'EnrolledCourseGroupRow';

Row.propTypes = {
  item: PropTypes.object.isRequired,
  startIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  sortConfig: PropTypes.object,
  data: PropTypes.array.isRequired,
  permissions: PropTypes.array,
};

export const EnrolledCourseGroupsTable = ({
  data,
  permissions,
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
              <Table.ColumnHeader w='15%'>
                <SortableHeader
                  label='Código'
                  columnKey='course_code'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='40%'>
                <SortableHeader
                  label='Nombre del Curso'
                  columnKey='course_name'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='10%' textAlign="center">
                <SortableHeader
                  label='Ciclo'
                  columnKey='cycle'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='10%' textAlign="center">
                <SortableHeader
                  label='Créditos'
                  columnKey='credits'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='20%' textAlign="center">
                <SortableHeader
                  label='Tipo'
                  columnKey='is_mandatory'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
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
                  permissions={permissions}
                  startIndex={startIndex}
                  index={index}
                />
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6} textAlign='center' py={2}>
                  No hay grupos de cursos disponibles.
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

EnrolledCourseGroupsTable.propTypes = {
  data: PropTypes.array,
  permissions: PropTypes.array,
  isLoading: PropTypes.bool,
};