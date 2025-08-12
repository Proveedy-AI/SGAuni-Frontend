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
  Table,
  TableScrollArea
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
  } = useReadCourseGradesByCourseId(
    decrypted, 
    {}, 
    { enabled: !!decrypted }
  );

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const statBg = useColorModeValue("blue.50", "blue.800");

  const getGradeColor = (grade) => {
    if (!grade) return "gray.400";
    if (grade >= 11) return "blue.400";
    return "red.400";
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

  const getFinalGradeStatusConfig = (finalGrade) => {
    if (finalGrade === null || finalGrade === undefined) {
      return {
        label: "En curso",
        bg: "gray.500", 
        color: "white"
      };
    }
    
    if (finalGrade < 11) {
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

  const calculateWeightedAverage = (evaluations) => {
    if (!evaluations) return 0;
    
    const evaluatedItems = evaluations.filter(evaluation => evaluation.grade_obtained !== null);
    if (evaluatedItems.length === 0) return 0;
    
    const totalWeight = evaluatedItems.reduce((sum, evaluation) => sum + evaluation.weight_percentage, 0);
    const weightedSum = evaluatedItems.reduce((sum, evaluation) => 
      sum + (evaluation.grade_obtained * evaluation.weight_percentage), 0);
    
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(1) : 0;
  };

  const pendingEvaluations = data?.evaluations?.filter(evaluation => evaluation.grade_obtained === null).length || 0;
  const completedEvaluations = data?.evaluations?.filter(evaluation => evaluation.grade_obtained !== null).length || 0;
  const currentAverage = data?.final_grade || calculateWeightedAverage(data?.evaluations);
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
              <Stat.ValueUnit color={getGradeColor(data?.final_grade || currentAverage)}>
                {data?.final_grade?.toFixed(1) || currentAverage || "0.0"}
              </Stat.ValueUnit>
              <Stat.HelpText>
                {data?.final_grade ? 'Nota final oficial' : 'Promedio calculado'}
              </Stat.HelpText>
            </Stat.Root>
          </GridItem>
          <GridItem>
            <Stat.Root bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor}>
              <Stat.Label>Evaluaciones Completadas</Stat.Label>
              <Stat.ValueUnit color="green.500">{completedEvaluations}</Stat.ValueUnit>
              <Stat.HelpText>
                De {totalEvaluations} totales
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
              <Stat.Label>Estado del Curso</Stat.Label>
              <Stat.ValueUnit color={getFinalGradeStatusConfig(data?.final_grade).color}>
                {getFinalGradeStatusConfig(data?.final_grade).label}
              </Stat.ValueUnit>
              <Stat.HelpText>
                {data?.course_info?.qualification_type || 'Sistema de calificación'}
              </Stat.HelpText>
            </Stat.Root>
          </GridItem>
        </Grid>

        {/* Tabla de Evaluaciones */}
        <Card.Root bg={bgColor} borderColor={borderColor}>
          <Card.Header p={0} bg={headerBg}>
            <Heading p={4} size="md" color="blue.700">
              Detalle de Evaluaciones
            </Heading>
          </Card.Header>
          <Card.Body p={0}>
            <Box overflowX="auto">
              <TableScrollArea>
                <Table.Root variant="simple" size="sm">
                  <Table.Header>
                    <Table.Row fontWeight="bold" color="blue.700" textAlign="center">
                      <Table.Cell minW="240px" textAlign="center" borderRight="1px solid" borderRightColor={borderColor}>
                        Evaluación
                      </Table.Cell>
                      <Table.Cell width="120px" textAlign="center" borderRight="1px solid" borderRightColor={borderColor}>
                        Calificación
                      </Table.Cell>
                      <Table.Cell width="120px" textAlign="center" borderRight="1px solid" borderRightColor={borderColor}>
                        Estado
                      </Table.Cell>
                      <Table.Cell width="120px" textAlign="center" borderRight="1px solid" borderRightColor={borderColor}>
                        Peso (%)
                      </Table.Cell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {data?.evaluations?.map((evaluation, index) => {
                      const statusConfig = getStatusConfig(evaluation.grade_obtained);
                      return (
                        <Table.Row key={evaluation.component_id || index} borderColor={borderColor}>
                          <Table.Cell borderRight="1px solid" borderRightColor={borderColor}>
                            <Text fontWeight="medium" color="gray.700">
                              {evaluation.evaluation_name}
                            </Text>
                          </Table.Cell>
                          <Table.Cell textAlign="center" borderRight="1px solid" borderRightColor={borderColor}>
                            {evaluation.grade_obtained && (
                              <Badge 
                                bg={getGradeColor(evaluation.grade_obtained)}
                                variant="solid"
                                p={1}
                                boxSize={6}
                                textAlign="center"
                                justifyContent="center"
                                color="white"
                                borderRadius="md"
                              >
                                {evaluation.grade_obtained}
                              </Badge>
                            )}
                          </Table.Cell>
                          <Table.Cell textAlign="center" borderRight="1px solid" borderRightColor={borderColor}>
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
                          <Table.Cell textAlign="center" borderRight="1px solid" borderRightColor={borderColor}>
                            <Text fontWeight="medium" color="blue.600">
                              {evaluation.weight_percentage}%
                            </Text>
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
      </VStack>
    </Box>
  );
}