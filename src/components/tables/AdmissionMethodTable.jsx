import { Button, Pagination } from "@/components/ui"
import { HStack, Table, Switch, Box } from "@chakra-ui/react"
import { useState } from "react"
import { HiEye, HiPencil, HiTrash } from "react-icons/hi2"
import { RowsPerPageSelect } from "../select"

export const AdmissionMethodTable = ({ setMethods, methods, handleOpenModal }) => {
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

  const paginatedData = methods.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

  //const { mutateAsync: toggleMethod, isPending: isPendingToggle } = useToggleMethod();
  const [isPendingToggle, setIsPendingToggle] = useState(false); // Simulación de estado de carga

  const handleStatusChange = async (methodId) => {
    //simulación de llamada a la API
    setIsPendingToggle(true);
    setTimeout(() => {
      setMethods((prevMethods) => 
        prevMethods.map((m) => 
          m.id === methodId ? { ...m, enabled: !m.enabled } : m
        )
      );
      setIsPendingToggle(false);
    }, 1500);


    // Hacer su try/catch para await toggleMethod(methodId)
  }
  
  return (
    <HStack
      w="full"
      background={{ base: "white", _dark: "gray.800" }}
      border="1px solid"
      borderColor={{ base: "#E2E8F0", _dark: "gray.700" }}
      borderRadius="lg"
      p={2}
      overflow="hidden"
      boxShadow="md"
    >
      <Box w='full' overflowX='auto'>
        <Table.Root size="sm" width="full" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Nº</Table.ColumnHeader>
              <Table.ColumnHeader>Nombre del Rol</Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              paginatedData.map((method, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{(currentPage - 1) * rowsPerPage + index + 1}</Table.Cell>
                  <Table.Cell>{method.name}</Table.Cell>
                  <Table.Cell width='150px'>
                    <Switch.Root
                      checked={method.enabled}
                      display='flex'
                      justifyContent='space-between'
                      onCheckedChange={() => handleStatusChange(method.id)}
                      disabled={isPendingToggle}
                    >
                      <Switch.Label>{method.enabled ? 'Activo' : 'Inactivo'}</Switch.Label>
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
                    <HStack>
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
                  count={methods.length}
                  pageSize={rowsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </Box>
    </HStack>
  )
}