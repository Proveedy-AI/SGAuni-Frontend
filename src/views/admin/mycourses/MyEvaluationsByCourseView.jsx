import { useColorModeValue } from "@/components/ui";
import { 
  Box, 
  Heading, 
  Text, 
  Badge, 
  HStack,
  Card,
  Table,
  TableScrollArea,
  Flex,
  SimpleGrid
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui";
import { Encryptor } from "@/components/CrytoJS/Encryptor";
import { useReadCourseGradesByCourseId } from "@/hooks/students";
import { FiArrowLeft } from "react-icons/fi";

export const MyEvaluationsByCourseView = () => {
  const { id } = useParams();
  const decoded = decodeURIComponent(id);
  const decrypted = Encryptor.decrypt(decoded);

  const navigate = useNavigate();

  const {
    data: dataMyEvaluations,
    isLoading: isLoadingMyEvaluations,
  } = useReadCourseGradesByCourseId(
    decrypted, 
    {}, 
    { enabled: !!decrypted }
  );

  console.log(dataMyEvaluations)

  const hasConfiguratedWithWeight = dataMyEvaluations?.data?.evaluations?.some(
    (evaluation) => evaluation.weight_percentage !== null
  );

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const getGradeColor = (grade) => {
    if (!grade) return "gray.600";
    if (grade >= 11) return "blue.600";
    return "red.600";
  };

  const getStatusConfig = (grade) => {
    if (grade === null || grade === undefined) {
      return {
        label: "Sin calificar",
        bg: "gray.500",
        color: "white"
      };
    }
    
    if (grade < 11) {
      return {
        label: "Desaprobado",
        bg: "red.50",
        color: "red.600"
      };
    }
    
    return {
      label: "Aprobado", 
      bg: "blue.50",
      color: "blue.600"
    };
  };

  const data = dataMyEvaluations?.data;

  const pendingEvaluations = data?.evaluations?.filter(evaluation => evaluation.grade_obtained === null).length || 0;
  const completedEvaluations = data?.evaluations?.filter(evaluation => evaluation.grade_obtained !== null).length || 0;
  const totalEvaluations = data?.course_info?.number_of_evaluations || data?.evaluations?.length || 0;

  // Mostrar loader mientras se cargan los datos
  if (isLoadingMyEvaluations) {
    return (
      <Box p={6} maxW="full" mx="auto" textAlign="center">
        <Text>Cargando evaluaciones...</Text>
      </Box>
    );
  }

  // Si no hay datos
  if (!data) {
    return (
      <Box p={6} maxW="full" mx="auto" textAlign="center">
        <Text>No se encontraron datos de evaluaciones</Text>
      </Box>
    );
  }

  return (
    <Box maxW="full" mx="auto">
      {/* Header con botón de regreso */}
      <Button
        variant="ghost"
        size="md"
        mb={4}
        onClick={() => navigate(-1)}
        bg="gray.50"
        _hover={{ bg: "gray.100" }}
        color="red.700"
        fontWeight="medium"
      >
        <FiArrowLeft /> <Text color="gray.700">Volver</Text>
      </Button>

      <Card.Root bg="blue.50" p={6} borderRadius="xl">
        <Flex direction={{ base: 'column', lg: 'row' }} align="center" justify="space-between" gap={4} overflow="hidden">
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="blue.700">
              {data.course_info?.course_code}- {data.course_info?.course_name}
            </Text>
          </Box>
          <HStack mt={2} spacing={4}>
            <Badge bg="white" px={2} py={1} border="2px solid" borderColor="purple.200" borderRadius="md">
              Sección: <Text as="span" fontWeight="bold" ml={1}>{data.course_info?.group_section}</Text>
            </Badge>
              <Badge bg="white" px={2} py={1} border="2px solid" borderColor="blue.200" borderRadius="md">
              Estado: <Text as="span" fontWeight="bold" ml={1}>{data.course_info?.qualification_status}</Text>
            </Badge>
          </HStack>
        </Flex>

        {/* Estadísticas */}
        <SimpleGrid columns={{ base: 1, lg: 4 }} gap={4} mt={6} overflow={"hidden"}>
          <Flex direction="column" justify="space-between" bg="white" borderRadius="lg" p={4} boxShadow="sm">
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              Promedio Final
            </Text>
            <Flex justify="space-between" align="center">
              <Text fontSize="xs" color="gray.400">
                Nota Final Oficial
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {data?.final_grade}
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column" justify="space-between" bg="white" borderRadius="lg" p={4} boxShadow="sm">
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              Evaluaciones Completadas
            </Text>
            <Flex justify="space-between" align="center">
              <Text fontSize="xs" color="gray.400">
                De {totalEvaluations} Totales
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {completedEvaluations}
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column" justify="space-between" bg="white" borderRadius="lg" p={4} boxShadow="sm">
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              Evaluaciones Pendientes
            </Text>
            <Flex justify="space-between" align="center">
              <Text fontSize="xs" color="gray.400">
                Por Realizar
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                {pendingEvaluations}
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column" justify="space-between" bg="white" borderRadius="lg" p={4} boxShadow="sm">
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              Estado del Curso
            </Text>
            <Text textAlign="end" fontSize="xl" fontWeight="bold" color={data?.final_grade >= 10.5 ? "blue.700" : "red.600"}>
              {data?.final_grade >= 10.5 ? "Aprobado" : "Desaprobado"}
            </Text>
          </Flex>
        </SimpleGrid>
      </Card.Root>

      <Heading p={4} size="md" color="blue.700">
        Detalle de Evaluaciones
      </Heading>

      <Card.Root bg={bgColor} borderColor={borderColor}>
        <Card.Body p={3}>
          <Box overflowX="auto">
            <TableScrollArea>
              <Table.Root>
                <Table.Header>
                  <Table.Row bg="blue.50" fontWeight="bold" textAlign="center">
                    <Table.Cell minW="240px" textAlign="center" borderRightColor={borderColor}>
                      Evaluación
                    </Table.Cell>
                    {hasConfiguratedWithWeight && (
                      <Table.Cell width="120px" textAlign="center" borderRightColor={borderColor}>
                        Peso
                      </Table.Cell>
                    )}
                    <Table.Cell width="120px" textAlign="center" borderRightColor={borderColor}>
                      Nota
                    </Table.Cell>
                    <Table.Cell width="120px" textAlign="center" borderRightColor={borderColor}>
                      Estado
                    </Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data?.evaluations?.map((evaluation, index) => {
                    const statusConfig = getStatusConfig(evaluation.grade_obtained);
                    return (
                      <Table.Row 
                        key={index}
                        bg={index % 2 === 0 ? "white" : "gray.100"}
                        borderColor={borderColor}
                      >
                        <Table.Cell borderRightColor={borderColor}>
                          <Text fontWeight="medium" color="gray.700">
                            Evaluación {index + 1} - {evaluation.evaluation_name}
                          </Text>
                        </Table.Cell>
                        {
                          hasConfiguratedWithWeight && (
                            <Table.Cell textAlign="center" borderRightColor={borderColor}>
                              {evaluation.weight_percentage}%
                            </Table.Cell>
                          )
                        }
                        <Table.Cell textAlign="center" borderRightColor={borderColor}>
                          {evaluation.grade_obtained ? (
                            <Badge 
                              bg={getGradeColor(evaluation.grade_obtained)}
                              variant="solid"
                              px={3}
                              py={1}
                              boxSize={4}
                              textAlign="center"
                              justifyContent="center"
                              color="white"
                              borderRadius="sm"
                            >
                              {evaluation.grade_obtained}
                            </Badge>
                          ) : '-' }
                        </Table.Cell>
                        <Table.Cell textAlign="center" borderRightColor={borderColor}>
                          <Badge 
                            bg={statusConfig.bg}
                            color={statusConfig.color}
                            variant="subtle"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {statusConfig.label}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    );
                  }) || []}
                </Table.Body>
              </Table.Root>
            </TableScrollArea>
          </Box>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}