import { Button, Switch, Pagination } from "@/components/ui"
import { HStack, Table } from "@chakra-ui/react"
import { useState } from "react"
import { FiUserPlus } from "react-icons/fi"
import { HiEye, HiPencil, HiTrash } from "react-icons/hi2"
import { RowsPerPageSelect } from "../select"

export const UserTable = ({ users, setUsers, handleOpenModal }) => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPageOptions = [
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '50', value: '50' },
  ];

  const handleRowsPerPageChange = (option) => {
    setRowsPerPage(Number(option.value));
    setCurrentPage(1);
  };

  const paginatedData = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleAvailableUsers = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  }

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
            <Table.ColumnHeader>Nombre de usuario</Table.ColumnHeader>
            <Table.ColumnHeader>Estado</Table.ColumnHeader>
            <Table.ColumnHeader>Acciones</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
          
        <Table.Body>
          {paginatedData.map((item, idx) => (
            <Table.Row
              key={idx}
              background={
                idx % 2 === 0
                  ? { base: "gray.100", _dark: "gray.800" }
                  : { base: "white", _dark: "black" }
              }
            >
              <Table.Cell >{(currentPage - 1) * rowsPerPage + idx + 1}</Table.Cell>
              <Table.Cell >{item.username}</Table.Cell>
              <Table.Cell >
                <Switch size="md" colorPalette="blue" pr={3} defaultChecked={item.isActive}
                  onChange={() => handleAvailableUsers(item.id)}
                />
                  {item.isActive ? "Activo" : "Inactivo"}
                </Table.Cell>
              <Table.Cell display="flex" flexWrap='wrap' alignItems='center' gap={2}>
                <Button
                  background={{ base: "#0661D8", _dark: "#3182ce" }}
                  color="white"
                  width="1"
                  variant="outline"
                  size="sm"
                  borderRadius="md"
                  onClick={() => handleOpenModal("view", item)}
                  _hover={{ background: { base: "#054ca6", _dark: "#2563eb" } }}
                >
                  <HiEye />
                </Button>
                <Button
                  background={{ base: "#2D9F2D", _dark: "#38a169" }}
                  color="white"
                  width="1"
                  variant="outline"
                  size="sm"
                  borderRadius="md"
                  onClick={() => handleOpenModal("edit", item)}
                  _hover={{ background: { base: "#217821", _dark: "#276749" } }}
                >
                  <HiPencil />
                </Button>
                <Button
                  background={{ base: "#9049DB", _dark: "#805ad5" }}
                  color="white"
                  width="1"
                  variant="outline"
                  size="sm"
                  borderRadius="md"
                  onClick={() => handleOpenModal("toogleRole", item)}
                  _hover={{ background: { base: "#6c32a6", _dark: "#6b46c1" } }}
                >
                  <FiUserPlus />
                </Button>
                <Button
                  background={{ base: "#E0383B", _dark: "#e53e3e" }}
                  color="white"
                  width="1"
                  variant="outline"
                  size="sm"
                  borderRadius="md"
                  onClick={() => handleOpenModal("delete", item)}
                  _hover={{ background: { base: "#b32c2e", _dark: "#c53030" } }}
                >
                  <HiTrash />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
          
        <Table.Footer>
          <Table.Row>
            <Table.ColumnHeader colSpan={1}>
              {/* Aquí va la paginación */}
              <HStack spacing={2}>
                <RowsPerPageSelect
                  options={rowsPerPageOptions}
                  onChange={(value) => handleRowsPerPageChange({ value })}
                />
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader colSpan={4}>
              <Pagination
                count={users.length}
                pageSize={rowsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </HStack>
  )
}