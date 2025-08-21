import ResponsiveBreadcrumb from "@/components/ui/ResponsiveBreadcrumb";
import { useReadPrograms } from "@/hooks";
import { useReadMyPrograms } from "@/hooks/person/useReadMyPrograms";
import { 
  Box, 
  Text, 
  Flex, 
  Heading, 
  Card,
  Badge,
  Table,
  HStack,
  Group,
} from "@chakra-ui/react";
import { FiFileText } from "react-icons/fi";
import { AddTransferRequestModal, PreviewDocumentRequestModal } from "@/components/modals/procedures";
import { useReadMyTransferRequest } from "@/hooks/transfer_requests";
import { useReadUserLogged } from "@/hooks/users/useReadUserLogged";

export const MyInternalTransferProcessView = () => {
  const { data: dataUserLogged, isLoading: isLoadingUserLogged } = useReadUserLogged();
  const { data: dataMyRequests } = useReadMyTransferRequest();
  console.log('my-requests', dataMyRequests)
  /*
  const {
    data:dataTransferRequests,
    isLoading: isLoadingTransferRequests
    refetch: fetchTransferRequests
  } = useReadMyTransferRequests();  
  */
  //1: En revisión, 2: Aprobado, 3: Rechazado
  const localTransferRequests = [
    {
      id: 1,
      program_id: 1,
      program_name_from: "Maestría en Contabilidad",
      program_destination_id: 2,
      program_destination_name: "Maestria en Administración",
      document_path: "path/to/document1.pdf",
      created_at: "2025-01-15T10:30:00Z",
      status: 3,
      status_display: "Rechazado",
    },
    {
      id: 2,
      program_id: 2,
      program_name_from: "Maestria en Administración",
      program_destination_id: 3,
      program_destination_name: "Maestria en Data Science",
      document_path: "path/to/document2.pdf",
      created_at: "2025-02-10T14:20:00Z",
      status: 3,
      status_display: "Rechazado",
    },
  ];

  const isEjecutable = !localTransferRequests.some(req => req.status === 1);

  const {
    data: dataMyPrograms,
  } = useReadMyPrograms();
  console.log("dataMyPrograms", dataMyPrograms);

  const {
    data: dataPrograms,
  } = useReadPrograms();
  console.log("dataPrograms", dataPrograms);

  const getStatusColor = (status) => {
    switch (status) {
      case 1: return 'blue';
      case 2: return 'green';
      case 3: return 'red';
      default: return 'gray';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box spaceY='5' p={{ base: 4, md: 6 }} maxW='8xl' mx='auto'>
      <ResponsiveBreadcrumb
        items={[
          { label: 'Trámites', to: '/myprocedures' },
          { label: 'Proceso de traslado interno' },
        ]}
      />

      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="gray.800">
          Mis Solicitudes de Traslado
        </Heading>
        {isEjecutable && (
          <AddTransferRequestModal
            user={dataUserLogged}
            dataMyPrograms={dataMyPrograms} 
            dataPrograms={dataPrograms} 
          />
        )}
      </Flex>

      {/* Información de estado */}
      {!isEjecutable && (
        <Card.Root mb={6}>
          <Card.Body>
            <HStack spacing={3}>
              <Box p={2} bg="blue.50" borderRadius="md">
                <FiFileText color="blue.500" size={20} />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="blue.700">
                  Solicitud en proceso
                </Text>
                <Text fontSize="xs" color="blue.600">
                  Tienes una solicitud pendiente de revisión. No puedes enviar nuevas solicitudes hasta que se resuelva.
                </Text>
              </Box>
            </HStack>
          </Card.Body>
        </Card.Root>
      )}

      {/* Tabla de solicitudes */}
      <Card.Root>
        <Card.Header>
          <Card.Title>
            Historial de Solicitudes ({localTransferRequests.length})
          </Card.Title>
        </Card.Header>
        <Card.Body p={0}>
          {localTransferRequests.length === 0 ? (
            <Box p={8} textAlign="center">
              <FiFileText size={48} color="gray.400" style={{ margin: '0 auto 16px' }} />
              <Text fontSize="lg" fontWeight="medium" color="gray.600" mb={2}>
                No tienes solicitudes de traslado
              </Text>
              <Text fontSize="sm" color="gray.500">
                Cuando envíes una solicitud, aparecerá aquí
              </Text>
            </Box>
          ) : (
            <Table.ScrollArea borderWidth="0px" m={6}>
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row bg="gray.50">
                    <Table.ColumnHeader fontWeight="semibold" color="gray.700">
                      N°
                    </Table.ColumnHeader>
                    <Table.ColumnHeader fontWeight="semibold" color="gray.700">
                      Programa Origen
                    </Table.ColumnHeader>
                    <Table.ColumnHeader fontWeight="semibold" color="gray.700">
                      Programa Destino
                    </Table.ColumnHeader>
                    <Table.ColumnHeader fontWeight="semibold" color="gray.700">
                      Fecha Solicitud
                    </Table.ColumnHeader>
                    <Table.ColumnHeader fontWeight="semibold" color="gray.700">
                      Estado
                    </Table.ColumnHeader>
                    <Table.ColumnHeader fontWeight="semibold" color="gray.700">
                      Acciones
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {localTransferRequests.map((request, index) => (
                    <Table.Row key={request.id} _hover={{ bg: "gray.50" }}>
                      <Table.Cell fontWeight="medium">
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" fontWeight="medium">
                          {request.program_name_from}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" fontWeight="medium">
                          {request.program_destination_name}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.600">
                          {formatDate(request.created_at)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          colorPalette={getStatusColor(request.status)}
                          size="sm"
                        >
                          {request.status_display}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Group>
                          <PreviewDocumentRequestModal documentPath={request.document_path} />
                        </Group>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          )}
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

