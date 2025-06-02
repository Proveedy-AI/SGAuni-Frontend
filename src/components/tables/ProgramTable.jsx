import { Button, Pagination } from "@/components/ui";
import { HStack, Table, Switch } from "@chakra-ui/react";
import { useState } from "react";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import { RowsPerPageSelect } from "../select";
import { COORDINADORES } from "@/data";

export const ProgramTable = ({ programs, handleOpenModal }) => {
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
};
