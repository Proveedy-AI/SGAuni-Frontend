import { useMyEvaluationsByCourse } from "@/hooks/mycourses";
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

export const MyEvaluationsByCourseView = () => {
const { id } = useParams();
  const decoded = decodeURIComponent(id);
  const decrypted = Encryptor.decrypt(decoded);

  const navigate = useNavigate();

  const {
    // data: dataMyEvaluations, // No funcional por ahora, usando localMyEvaluations
    isLoading: isLoadingMyEvaluations,
  } = useMyEvaluationsByCourse(decrypted);

  // Datos locales de ejemplo
  const localMyEvaluations = {
    course_info: {
      id: 1,
      course_name: "Fundamentos de Administración",
      course_code: "ADM101",
      credits: 4,
      teacher_name: "Dr. Juan Pérez",
      group_code: "A1",
      program_name: "Maestría en Administración",
      period: "2025-1",
      final_average: 15.2
    },
    evaluations: [
      {
        id: 1,
        name: "Examen Parcial 1",
        grade: 16,
        weight: 25,
        date: "2025-03-15",
        status: "evaluated"
      },
      {
        id: 2,
        name: "Trabajo Grupal",
        grade: 18,
        weight: 20,
        date: "2025-04-10",
        status: "evaluated"
      },
      {
        id: 3,
        name: "Examen Parcial 2",
        grade: 14,
        weight: 25,
        date: "2025-05-20",
        status: "evaluated"
      },
      {
        id: 4,
        name: "Proyecto Final",
        grade: 15,
        weight: 30,
        date: "2025-06-25",
        status: "evaluated"
      },
      {
        id: 5,
        name: "Examen Final",
        grade: null,
        weight: 0,
        date: "2025-07-15",
        status: "pending"
      }
    ]
  };

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

  const calculateWeightedAverage = (evaluations) => {
    const evaluatedItems = evaluations.filter(evaluation => evaluation.grade !== null && evaluation.weight > 0);
    if (evaluatedItems.length === 0) return 0;
    
    const totalWeight = evaluatedItems.reduce((sum, evaluation) => sum + evaluation.weight, 0);
    const weightedSum = evaluatedItems.reduce((sum, evaluation) => sum + (evaluation.grade * evaluation.weight), 0);
    
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(1) : 0;
  };

  const pendingEvaluations = localMyEvaluations.evaluations.filter(evaluation => evaluation.status === "pending").length;
  const completedEvaluations = localMyEvaluations.evaluations.filter(evaluation => evaluation.status === "evaluated").length;
  const currentAverage = calculateWeightedAverage(localMyEvaluations.evaluations);

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
                {localMyEvaluations.course_info.course_code} - {localMyEvaluations.course_info.course_name}
              </Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
              <GridItem >
                <Box display="flex" alignItems="center" gapX={3}>
                  <FaUser /> Docente
                </Box>
                <Text fontWeight="medium">{localMyEvaluations.course_info.teacher_name}</Text>
              </GridItem>
              <GridItem>
                <Box display="flex" alignItems="center" gapX={3}>
                  <FaUser /> Sección
                </Box>
                <Text fontWeight="medium">{localMyEvaluations.course_info.group_code}</Text>
              </GridItem>
              <GridItem>
                <Box display="flex" alignItems="center" gapX={3}>
                  <FaUser /> Créditos
                </Box>
                <Text fontWeight="medium">{localMyEvaluations.course_info.credits}</Text>
              </GridItem>
              <GridItem>
                <Box display="flex" alignItems="center" gapX={3}>
                  <FaUser /> Período
                </Box>
                <Text fontWeight="medium">{localMyEvaluations.course_info.period}</Text>
              </GridItem>
            </Grid>
          </Card.Body>
        </Card.Root>

        {/* Estadísticas Rápidas */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
          <GridItem>
            <Stat.Root bg={statBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor}>
              <Stat.Label>Promedio Actual</Stat.Label>
              <Stat.ValueUnit color={getGradeColor(currentAverage)}>
                {currentAverage}
              </Stat.ValueUnit>
              <Stat.HelpText>
                Basado en evaluaciones completadas
              </Stat.HelpText>
            </Stat.Root>
          </GridItem>
          <GridItem>
            <Stat.Root bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor}>
              <Stat.Label>Evaluaciones Completadas</Stat.Label>
              <Stat.ValueUnit color="green.500">{completedEvaluations}</Stat.ValueUnit>
              <Stat.HelpText>
                De {localMyEvaluations.evaluations.length} totales
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
                      Estado
                    </Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {localMyEvaluations.evaluations.map((evaluation) => (
                    <Table.Row key={evaluation.id} borderColor={borderColor}>
                      <Table.Cell>
                        <Text fontWeight="medium" color="gray.700">
                          {evaluation.name}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {evaluation.grade !== null ? (
                          <Badge 
                            bg={getGradeColor(evaluation.grade)}
                            variant={getGradeBadgeVariant(evaluation.grade)}
                            p={1}
                            boxSize={6}
                            textAlign={"center"}
                            justifyContent="center"
                            color="white"
                            borderRadius="md"
                          >
                            {evaluation.grade}
                          </Badge>
                        ) : (
                          <Badge bg="gray.300" variant="outline" p={2} borderRadius="md">
                            No evaluado
                          </Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text fontWeight="medium">
                          {evaluation.weight > 0 ? `${evaluation.weight}%` : '-'}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text fontSize="sm" color="gray.600">
                          {formatDate(evaluation.date)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Badge 
                          bg={evaluation.status === "evaluated" ? "green.300" : "orange.300"}
                          variant="subtle"
                          color={evaluation.status === "evaluated" ? "green.700" : "orange.700"}
                        >
                          {evaluation.status === "evaluated" ? "Evaluado" : "Pendiente"}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
}