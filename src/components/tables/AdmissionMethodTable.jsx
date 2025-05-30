import { Button, Switch } from "@/components/ui"
import { Box, Heading, HStack, Table } from "@chakra-ui/react"
import { useState } from "react"
import { FiSettings } from "react-icons/fi"
import { HiPlus, HiEye, HiPencil, HiTrash } from "react-icons/hi2"

export const AdmissionMethodTable = ({ methods, handleOpenModal }) => {
  const [rowsPerPage, setRowsPerPage] = useState(methods.length);
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowsPerPageChange = (option) => {
    setRowsPerPage(Number(option.value));
    setCurrentPage(1);
  };
  
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
            <Table.ColumnHeader>Nombre del Rol</Table.ColumnHeader>
            <Table.ColumnHeader>Acciones</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            methods.map((method, index) => (
              <Table.Row
                key={index}
                background={
                  index % 2 === 0
                    ? { base: "gray.100", _dark: "gray.800" }
                    : { base: "white", _dark: "black" }
                }
              >
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{method.name}</Table.Cell>
                <Table.Cell >
                  <Switch size="md" colorPalette="blue" pr={3} defaultChecked={method.isActive} />
                  {method.isActive ? "Activo" : "Inactivo"}
                </Table.Cell>
                <Table.Cell>
                  <HStack spacing={2}>
                    <Button
                      background={{ base: "#0661D8", _dark: "#3182ce" }}
                      color="white"
                      width="1"
                      variant="outline"
                      size="sm"
                      borderRadius="md"
                      onClick={() => handleOpenModal("view", method)}
                      _hover={{ background: { base: "#054ca6", _dark: "#2563eb" } }}
                    >
                      <HiEye size={20} />
                    </Button>
                    <Button
                      background={{ base: "#2D9F2D", _dark: "#38a169" }}
                      color="white"
                      width="1"
                      variant="outline"
                      size="sm"
                      borderRadius="md"
                      onClick={() => handleOpenModal("edit", method)}
                      _hover={{ background: { base: "#217821", _dark: "#276749" } }}
                    >
                      <HiPencil size={20} />
                    </Button>
                    <Button 
                      background={{ base: "#E0383B", _dark: "#e53e3e" }}
                      color="white"
                      width="1"
                      variant="outline"
                      size="sm"
                      borderRadius="md"
                      onClick={() => handleOpenModal("delete", method)}
                      _hover={{ background: { base: "#b32c2e", _dark: "#c53030" } }}
                    >
                      <HiTrash size={20} />
                    </Button>
                  </HStack>
                </Table.Cell>    
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table.Root>
    </HStack>
  )
}