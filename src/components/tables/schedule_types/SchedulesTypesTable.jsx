import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Box, Group, HStack, Switch, Table } from '@chakra-ui/react';
import { Pagination, toaster } from '@/components/ui';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import useSortedData from '@/utils/useSortedData';
import { EditScheduleTypeModal } from '@/components/forms/schedule_types';
import { useUpdateScheduleType } from '@/hooks/schedule_types';

const Row = memo(
  ({
    item,
    fetchData,
    startIndex,
    index,
    sortConfig,
    data,
  }) => {
    const { mutate: update, isPending: isPendingToggle } = useUpdateScheduleType();

    const handleStatusChange = (id) => {
      const payload = { enabled: !item.enabled };
      update({ id, payload }, {
        onSuccess: () => {
          toaster.create({
            title: `Estado del tipo de horario actualizado correctamente`,
            type: 'success',
          })
          fetchData();
        },
        onError: (error) => {
          console.error(error);
          toaster.create({
            title:
              error?.message || 'Ocurrió un error al cambiar el estado del tipo de horario',
            type: 'error',
          });
        },
      });
    };

    return (
      <Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
        <Table.Cell>
          {sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
            ? data.length - (startIndex + index)
            : startIndex + index + 1}
        </Table.Cell>
        <Table.Cell>{item.name}</Table.Cell>
        <Table.Cell>{item.is_single ? 'Sí' : 'No'}</Table.Cell>
        <Table.Cell>
          <Switch.Root
            checked={item.enabled}
            onCheckedChange={() => handleStatusChange(item.id)}
            disabled={isPendingToggle}
          >
            <Switch.Label mr={5} w="64px">
              {item.enabled ? 'Activo' : 'Inactivo'}
            </Switch.Label>
            <Switch.HiddenInput />
            <Switch.Control
              _checked={{
                bg: 'uni.secondary',
              }}
              bg='uni.red.400'
            />
          </Switch.Root>
        </Table.Cell>

        <Table.Cell>
          <HStack justify='space-between'>
            <Group>
              <EditScheduleTypeModal data={data} item={item} fetchData={fetchData} />
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

export const SchedulesTypesTable = ({
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
              <Table.ColumnHeader w='30%'>
                <SortableHeader
                  label='Nombre'
                  columnKey='name'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='20%'>
                <SortableHeader
                  label='¿Es único?'
                  columnKey='is_single'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader w='20%'>
                <SortableHeader
                  label='Estado'
                  columnKey='enabled'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
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
                  fetchData={fetchData}
                  startIndex={startIndex}
                  index={index}
                />
              ))
            ) : (
              <Table.Cell colSpan={5} textAlign='center' py={2}>
                No hay datos disponibles.
              </Table.Cell>
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

SchedulesTypesTable.propTypes = {
  data: PropTypes.array,
  fetchData: PropTypes.func,
  isLoading: PropTypes.bool,
};
