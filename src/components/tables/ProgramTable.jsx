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

const Row = memo(({ item, fetchData, startIndex, index, programTypesOptions, coordinatorsOptions }) => {

  return (
    <Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
      <Table.Cell>{startIndex + index + 1}</Table.Cell>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>{item.type_detail.name}</Table.Cell>
      <Table.Cell>
        <HStack justify='space-between'>
          <Group>
            <ViewProgram item={item} />
            <EditProgram fetchData={fetchData} item={item} programTypesOptions={programTypesOptions} coordinatorsOptions={coordinatorsOptions} />
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
};

export const ProgramTable = ({ data, fetchData, programTypesOptions, coordinatorsOptions }) => {
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
};


/*export const ProgramTable2 = ({ programs, handleOpenModal }) => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPageOptions = [
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
  ];

  const handleRowsPerPageChange = (option) => {
    setRowsPerPage(Number(option.value));
    setCurrentPage(1);
  };

  const paginatedData = programs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <HStack
      w="full"
      background={{ base: "white", _dark: "gray.800" }}
      border="1px solid"
      borderColor={{ base: "#E2E8F0", _dark: "gray.700" }}
      borderRadius="md"
      p={2}
    >
      <Table.Root size="sm" width="full">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Nº</Table.ColumnHeader>
            <Table.ColumnHeader>Nombre del programa</Table.ColumnHeader>
            <Table.ColumnHeader>Tipo</Table.ColumnHeader>
            <Table.ColumnHeader>Coordinador(a)</Table.ColumnHeader>
            <Table.ColumnHeader>Acciones</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {paginatedData.map((program, idx) => (
            <Table.Row
              key={program.id}
              background={
                idx % 2 === 0
                  ? { base: "gray.100", _dark: "gray.800" }
                  : { base: "white", _dark: "black" }
              }
            >
              <Table.Cell>{(currentPage - 1) * rowsPerPage + idx + 1}</Table.Cell>
              <Table.Cell>{program.name}</Table.Cell>
              <Table.Cell>{program.type}</Table.Cell>
              <Table.Cell>{COORDINADORES.find((coordinador) => coordinador.id === program.coordinador_id).name}</Table.Cell>
              <Table.Cell>
                <HStack spacing={2}>
                  <Button
                    background={{ base: '#0661D8', _dark: '#3182ce' }}
										color='white'
										width='1'
										variant='outline'
										size='sm'
										borderRadius='md'
										onClick={() => handleOpenModal('view', program)}
										_hover={{
											background: { base: '#054ca6', _dark: '#2563eb' },
										}}
                  >
                    <HiEye />
                  </Button>
                  <Button
                    background={{ base: "#2D9F2D", _dark: "#38a169" }}
                    color="white"
										width='1'
                    variant="outline"
                    size="sm"
                    borderRadius="md"
                    onClick={() => handleOpenModal("edit", program)}
                    _hover={{ background: { base: "#217821", _dark: "#276749" } }}
                  >
                    <HiPencil />
                  </Button>
                  <Button
                    background={{ base: "#E0383B", _dark: "#e53e3e" }}
                    color="white"
                    width='1'
                    variant="outline"
                    size="sm"
                    borderRadius="md"
                    onClick={() => handleOpenModal("delete", program)}
                    _hover={{ background: { base: "#b32c2e", _dark: "#c53030" } }}
                  >
                    <HiTrash />
                  </Button>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.ColumnHeader colSpan={1}>
              <HStack spacing={2}>
                <RowsPerPageSelect
                  options={rowsPerPageOptions}
                  onChange={(value) => handleRowsPerPageChange({ value })}
                />
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader colSpan={6}>
              <Pagination
                count={programs.length}
                pageSize={rowsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </HStack>
  );
};*/
