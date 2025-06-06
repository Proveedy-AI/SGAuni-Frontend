import PropTypes from 'prop-types';
import { memo, useState } from "react";
import {
	Box,
	createListCollection,
	Group,
	HStack,
	Stack,
	Table,
} from '@chakra-ui/react';
import {
  Pagination,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui'
import { ViewProgram } from '../forms/management/programs/ViewProgram';
import { DeleteProgram } from '../forms/management/programs/DeleteProgram';
import { EditProgram } from '../forms/management/programs/EditProgram';

const Row = memo(({ item, fetchData, startIndex, index, programTypesOptions, coordinatorsOptions, loadingProgramTypes, loadingCoordinators }) => {

  return (
    <Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
      <Table.Cell>{startIndex + index + 1}</Table.Cell>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>{item.type_detail.name}</Table.Cell>
      <Table.Cell>
        <HStack justify='space-between'>
          <Group>
            <ViewProgram item={item} />
            <EditProgram 
              fetchData={fetchData} 
              item={item}
              programTypesOptions={programTypesOptions}
              coordinatorsOptions={coordinatorsOptions}
              loadingProgramTypes={loadingProgramTypes}
              loadingCoordinators={loadingCoordinators}
            />
            <DeleteProgram item={item} fetchData={fetchData} />
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
  programTypesOptions: PropTypes.array,
  coordinatorsOptions: PropTypes.array,
  loadingProgramTypes: PropTypes.bool,
  loadingCoordinators: PropTypes.bool,
};

export const ProgramTable = ({ data, fetchData, programTypesOptions, coordinatorsOptions, loadingProgramTypes, loadingCoordinators }) => {
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
              <Table.ColumnHeader>Nombre del programa</Table.ColumnHeader>
              <Table.ColumnHeader>Tipo</Table.ColumnHeader>
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
                programTypesOptions={programTypesOptions}
                coordinatorsOptions={coordinatorsOptions}
                loadingProgramTypes={loadingProgramTypes}
                loadingCoordinators={loadingCoordinators}
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

ProgramTable.propTypes = {
  data: PropTypes.array,
  fetchData: PropTypes.func,
  programTypesOptions: PropTypes.array,
  coordinatorsOptions: PropTypes.array,
  loadingProgramTypes: PropTypes.bool,
  loadingCoordinators: PropTypes.bool,
};