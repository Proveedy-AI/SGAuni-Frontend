import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { Pagination } from '@/components/ui';
import { formatDateString } from '@/components/ui/dateHelpers';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { SortableHeader } from '@/components/ui/SortableHeader';

import useSortedData from '@/utils/useSortedData';
import { Badge, Box, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router';

const Row = memo(
  ({
    item,
    startIndex,
    index,
    sortConfig,
    data,
    permissions
  }) => {
    const statusDisplay = [
      { id: 1, label: 'Por Empezar', bg: '#AEAEAE', color: '#F5F5F5' },
      { id: 2, label: 'En Curso', bg: '#C6E7FC80', color: '#0661D8' },
    ];

    const status = statusDisplay.find(s => s.id === item.status);

    const navigate = useNavigate();
	  const encrypted = Encryptor.encrypt(item.program);
    const encoded = encodeURIComponent(encrypted);
    const handleRowClick = () => {
      if (permissions.includes('classes.myclasses.view')) navigate(`/myclasses/myprograms/${encoded}`);
    };

    return (
      <Table.Row 
        key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}
        onClick={(e) => {
				  if (e.target.closest('button') || e.target.closest('a')) return;
				  handleRowClick();
			  }}
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
        <Table.Cell>{item.program_name}</Table.Cell>
        <Table.Cell>{formatDateString(item.semester_start_date)}</Table.Cell>
        <Table.Cell>
          {formatDateString(item.registration_start_date)}
        </Table.Cell>
        <Table.Cell>{formatDateString(item.registration_end_date)}</Table.Cell>
        <Table.Cell>
          <Badge
            bg={status?.bg}
            color={status?.color}
            borderRadius='md'
            px={2}
            py={1}
            fontSize='sm'
          >
            {status?.label}
          </Badge>
        </Table.Cell>
      </Table.Row>
    );
  }
);

Row.displayName = 'Row';

Row.propTypes = {
  item: PropTypes.object,
  startIndex: PropTypes.number,
  index: PropTypes.number,
  sortConfig: PropTypes.object,
  data: PropTypes.array,
  permissions: PropTypes.array,
};

export const ClassMyProgramsTable = ({
  data,
  isLoading,
  permissions
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
              <Table.ColumnHeader w={'5%'}>
                <SortableHeader
                  label='N°'
                  columnKey='index'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <SortableHeader
                  label='Programa'
                  columnKey='program_name'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <SortableHeader
                  label='Inicio Semestre'
                  columnKey='semester_start_date'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <SortableHeader
                  label='Inicio de Inscripciones'
                  columnKey='registration_start_date'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <SortableHeader
                  label='Fin de Inscripciones'
                  columnKey='registration_end_date'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <SortableHeader
                  label='Estado'
                  columnKey='status'
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
                  startIndex={startIndex}
                  index={index}
                  data={data}
                  sortConfig={sortConfig}
                  permissions={permissions}
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

ClassMyProgramsTable.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  permissions: PropTypes.array,
};
