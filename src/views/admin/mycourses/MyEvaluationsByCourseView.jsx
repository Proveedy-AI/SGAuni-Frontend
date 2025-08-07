import { useColorModeValue } from "@/components/ui";
import { 
  Box, 
  Heading, 
  Text, 
  Badge, 
  VStack,
  HStack,
  Card,
  Stat,
  Grid,
  GridItem,
  Spacer,
  Table
} from "@chakra-ui/react";
import { FaBookOpen, FaUser } from "react-icons/fa";
import { useParams, useNavigate } from "react-router";
import { IoArrowBack } from "react-icons/io5";
import { Button } from "@/components/ui";
import { Encryptor } from "@/components/CrytoJS/Encryptor";
import { useReadCourseGradesByCourseId } from "@/hooks/students";

export const MyEvaluationsByCourseView = () => {
const { id } = useParams();
  const decoded = decodeURIComponent(id);
  const decrypted = Encryptor.decrypt(decoded);

  const navigate = useNavigate();

  const {
    data: dataMyEvaluations,
    isLoading: isLoadingMyEvaluations,
  } = useReadCourseGradesByCourseId(decrypted, {}, { enabled: !!decrypted });

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const statBg = useColorModeValue("blue.50", "blue.800");

  const getGradeColor = (grade) => {
    if (grade >= 11) return "blue.400";
    return "red.400";
  };

  const getGradeBadgeVariant = (grade) => {
    if (grade === null) return "outline";
    return "solid";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const { data } = dataMyEvaluations;

  const calculateWeightedAverage = (evaluations) => {
    const evaluatedItems = evaluations?.filter(evaluation => evaluation.grade_obtained !== null && evaluation.weight_percentage > 0) || [];
    if (evaluatedItems.length === 0) return 0;
    
    const totalWeight = evaluatedItems.reduce((sum, evaluation) => sum + evaluation.weight_percentage, 0);
    const weightedSum = evaluatedItems.reduce((sum, evaluation) => sum + (evaluation.grade_obtained * evaluation.weight_percentage), 0);
    
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(1) : 0;
  };

  const pendingEvaluations = data?.evaluations?.filter(evaluation => evaluation.grade_obtained === null).length || 0;
  const completedEvaluations = data?.evaluations?.filter(evaluation => evaluation.grade_obtained !== null).length || 0;
  const currentAverage = data?.grade_summary?.calculated_average?.toFixed(1) || calculateWeightedAverage(data?.evaluations);

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
    <Box p={6} maxW="full" mx="auto">
      {/* Header con botón de regreso */}
      <HStack mb={6} align="center">
        <Button
          leftIcon={<IoArrowBack />}
          variant="ghost"
          onClick={() => navigate(-1)}
          size="sm"
        >
          Volver
        </Button>
        <Spacer />
      </HStack>

      <VStack spacing={6} align="stretch" overflow={"hidden"}>
        <Card.Root bg={bgColor} borderColor={borderColor}>
          <Card.Header bg={headerBg} borderRadius="lg lg 0 0">
            <HStack pb={5}>
              <FaBookOpen color="blue" />
              <Heading size="lg" color="blue.700">
                {data.course_info?.course_name}
              </Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
              <GridItem>
                <Box display="flex" alignItems="center" gapX={3}>
                  <FaUser /> Sección
                </Box>
                <Text fontWeight="medium">{data.course_info?.group_section}</Text>
              </GridItem>
              <GridItem>
                <Box display="flex" alignItems="center" gapX={3}>
                  <FaUser /> Período
                </Box>
                <Text fontWeight="medium">{data.course_info?.academic_period}</Text>
              </GridItem>
              <GridItem>
                <Box display="flex" alignItems="center" gapX={3}>
                  <FaUser /> Estado
                </Box>
                <Text fontWeight="medium">
                  {data.course_info?.qualification_status}
                  {data.course_info?.is_repeated && " (Repetido)"}
                </Text>
              </GridItem>
            </Grid>
          </Card.Body>
        </Card.Root>

        {/* Estadísticas Rápidas */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
          <GridItem>
            <Stat.Root bg={statBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor}>
              <Stat.Label>Promedio Final</Stat.Label>
              <Stat.ValueUnit color={getGradeColor(data.grade_summary?.final_grade || currentAverage)}>
                {data.grade_summary?.final_grade?.toFixed(1) || currentAverage}
              </Stat.ValueUnit>
              <Stat.HelpText>
                {data.grade_summary?.final_grade ? 'Nota final oficial' : 'Promedio calculado'}
              </Stat.HelpText>
            </Stat.Root>
          </GridItem>
          <GridItem>
            <Stat.Root bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor}>
              <Stat.Label>Evaluaciones Completadas</Stat.Label>
              <Stat.ValueUnit color="green.500">{completedEvaluations}</Stat.ValueUnit>
              <Stat.HelpText>
                De {data.evaluations?.length || 0} totales
              </Stat.HelpText>
            </Stat.Root>
          </GridItem>
          <GridItem>
            <Stat.Root bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor}>
              <Stat.Label>Evaluaciones Pendientes</Stat.Label>
              <Stat.ValueUnit color="orange.500">{pendingEvaluations}</Stat.ValueUnit>
              <Stat.HelpText>
                Por realizar
              </Stat.HelpText>
            </Stat.Root>
          </GridItem>
          <GridItem>
            <Stat.Root bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor}>
              <Stat.Label>Peso Total Usado</Stat.Label>
              <Stat.ValueUnit color="blue.500">
                {data.grade_summary?.total_weight_used || 0}%
              </Stat.ValueUnit>
              <Stat.HelpText>
                Del total evaluado
              </Stat.HelpText>
            </Stat.Root>
          </GridItem>
        </Grid>

        {/* Tabla de Evaluaciones */}
        <Card.Root bg={bgColor} borderColor={borderColor}>
          <Card.Header bg={headerBg}>
            <Heading size="md" color="blue.700">
              Detalle de Evaluaciones
            </Heading>
          </Card.Header>
          <Card.Body p={0}>
            <Box overflowX="auto">
              <Table.Root variant="simple" size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center" width="300px">
                      Evaluación
                    </Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center">
                      Calificación
                    </Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center">
                      Peso (%)
                    </Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center">
                      Fecha
                    </Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center">
                      Tipo
                    </Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center">
                      Estado
                    </Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.evaluations?.map((evaluation) => (
                    <Table.Row key={evaluation.id} borderColor={borderColor}>
                      <Table.Cell>
                        <Text fontWeight="medium" color="gray.700">
                          {evaluation.evaluation_name}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {evaluation.grade_obtained !== null ? (
                          <Badge 
                            bg={getGradeColor(evaluation.grade_obtained)}
                            variant={getGradeBadgeVariant(evaluation.grade_obtained)}
                            p={1}
                            boxSize={6}
                            textAlign={"center"}
                            justifyContent="center"
                            color="white"
                            borderRadius="md"
                          >
                            {evaluation.grade_obtained}
                          </Badge>
                        ) : (
                          <Badge bg="gray.300" variant="outline" p={2} borderRadius="md">
                            No evaluado
                          </Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text fontWeight="medium">
                          {evaluation.weight_percentage > 0 ? `${evaluation.weight_percentage}%` : '-'}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text fontSize="sm" color="gray.600">
                          {formatDate(evaluation.evaluation_date)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Badge variant="outline" colorScheme="blue">
                          {evaluation.qualification_type || 'N/A'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Badge 
                          bg={evaluation.grade_obtained !== null ? "green.300" : "orange.300"}
                          variant="subtle"
                          color={evaluation.grade_obtained !== null ? "green.700" : "orange.700"}
                        >
                          {evaluation.grade_obtained !== null ? "Evaluado" : "Pendiente"}
                        </Badge>
                        {evaluation.grade_conceptual && (
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            {evaluation.grade_conceptual}
                          </Text>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  )) || []}
                </Table.Body>
              </Table.Root>
            </Box>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
}