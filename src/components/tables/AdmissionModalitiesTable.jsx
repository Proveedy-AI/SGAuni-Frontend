import PropTypes from 'prop-types';
import { memo, useState } from "react";
import {
  Box,
  createListCollection,
  Group,
  HStack,
  Stack,
  Table,
  Switch
} from '@chakra-ui/react';
import {
  Pagination,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  toaster,
} from '@/components/ui'
import { AssignModalityRules, DeleteModality, EditModality, ViewModality } from '../forms/management/modalities';
import { useToggleModality } from '@/hooks';

const Row = memo(({ item, fetchData, startIndex, index }) => {
  const { mutateAsync: toggleModalityRule, isPending: isPendingToggle } = useToggleModality();

  const handleStatusChange = async (id) => {
    try {
      await toggleModalityRule(id);
      // Realiza la acción de toggle en el rol
      toaster.create({
        title: `Estado del rol actualizado correctamente`,
        type: 'success',
      });

      fetchData(); // Refetch data after toggling status
    } catch (error) {
      toaster.create({
        title: error?.message || 'Ocurrió un error al cambiar el estado del rol',
        type: 'error',
      });
    }
  }

  return (
    <Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
      <Table.Cell>{startIndex + index + 1}</Table.Cell>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>
        <Switch.Root
          checked={item.enabled}
          display='flex'
          justifyContent='space-between'
          onCheckedChange={() => handleStatusChange(item.id)}
          disabled={isPendingToggle}
        >
          {' '}
          <Switch.Label>
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
            <ViewModality item={item} />
            <EditModality fetchData={fetchData} item={item} />
            <AssignModalityRules item={item} fetchData={fetchData} />
            <DeleteModality item={item} fetchData={fetchData} />
          </Group>
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

export const AdmissionModalitiesTable = ({ data, fetchData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const startIndex = (currentPage - 1) * parseInt(pageSize);
  const endIndex = startIndex + parseInt(pageSize);
  const visibleRows = data?.slice(startIndex, endIndex);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const pageSizeOptions = [
    { label: '5 filas', value: '5' },
    { label: '10 filas', value: '10' },
    { label: '15 filas', value: '15' },
    { label: '20 filas', value: '20' },
    { label: '25 filas', value: '25' },
  ];

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
              <Table.ColumnHeader>N°</Table.ColumnHeader>
              <Table.ColumnHeader>Nombre del Rol</Table.ColumnHeader>
              <Table.ColumnHeader w='150px'>Estado</Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleRows?.map((item, index) => (
              <Row
                key={item.id}
                item={item}
                fetchData={fetchData}
                startIndex={startIndex}
                index={index}
              />
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      <Stack
        w='full'
        direction={{ base: 'column', sm: 'row' }}
        justify={{ base: 'center', sm: 'space-between' }}
        pt='2'
      >
        <SelectRoot
          collection={createListCollection({
            items: pageSizeOptions,
          })}
          size='xs'
          w='150px'
          display={{ base: 'none', sm: 'block' }}
          defaultValue={pageSize}
          onChange={(event) => handlePageSizeChange(event.target.value)}
        >
          <SelectTrigger>
            <SelectValueText placeholder='Seleccionar filas' />
          </SelectTrigger>
          <SelectContent bg={{ base: 'white', _dark: 'its.gray.500' }}>
            {pageSizeOptions.map((option) => (
              <SelectItem
                _hover={{
                  bg: {
                    base: 'its.100',
                    _dark: 'its.gray.400',
                  },
                }}
                key={option.value}
                item={option}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>

        <Pagination
          count={data?.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Stack>
    </Box>
  )
}

AdmissionModalitiesTable.propTypes = {
  data: PropTypes.array,
  fetchData: PropTypes.func,
};