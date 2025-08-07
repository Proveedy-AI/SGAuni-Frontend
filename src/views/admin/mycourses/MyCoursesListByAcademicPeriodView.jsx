import { Encryptor } from "@/components/CrytoJS/Encryptor";
import { useColorModeValue } from "@/components/ui";
import { useReadCoursesByPeriod } from "@/hooks/students";
import { 
  Box, 
  Heading, 
  Table, 
  Text, 
  Badge, 
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";

export const MyCoursesListByAcademicPeriodView = () => {
  const {
    data: dataCoursesByPeriod,
    isLoading: isLoadingCoursesByPeriod,
    error: errorCoursesByPeriod
  } = useReadCoursesByPeriod();

  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const periodHeaderBg = useColorModeValue("purple.100", "purple.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const summaryBg = useColorModeValue("gray.50", "gray.700");

  const getDayName = (dayNumber) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayNumber];
  };

  const formatSchedule = (schedules) => {
    if (!schedules || schedules.length === 0) return "Sin horario";
    
    return schedules.map(schedule => 
      `${getDayName(schedule.day_of_week)}: ${schedule.start_time} - ${schedule.end_time}`
    ).join(", ");
  };

  const getGradeColor = (grade) => {
    if (grade >= 11) return "blue.400";
    return "red.400";
  };

  const handleRowClick = (course) => {
    console.log(course);
    const encrypted = Encryptor.encrypt(course.id);
    const encoded = encodeURIComponent(encrypted);
    navigate(`/mycourses/${encoded}`);
  };

  // Error state
  if (errorCoursesByPeriod) {
    return (
      <Box p={6} maxW="full" mx="auto">
        <Box p={4} bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200">
          <Text color="red.600" fontWeight="medium">
            Error al cargar los cursos: {errorCoursesByPeriod.message || 'Error desconocido'}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="full" mx="auto">
      <Heading mb={3}>
        Mis Cursos
      </Heading>

      {isLoadingCoursesByPeriod ? (
        <Box p={6} maxW="full" mx="auto" textAlign="center">
          <Spinner size="lg" />
          <Text mt={4}>Cargando cursos...</Text>
        </Box>
      ) : (
        <VStack spacing={6} align="stretch">
        {!dataCoursesByPeriod?.data || dataCoursesByPeriod.data.length === 0 ? (
          <Box p={6} maxW="full" mx="auto" textAlign="center">
            <Text>No se encontraron cursos registrados.</Text>
          </Box>
        ) : dataCoursesByPeriod.data.map((periodData, periodIndex) => (
          <Box key={periodIndex} mb={3}>
            <Box 
              bg={periodHeaderBg} 
              py={2}
              textAlign="center" 
              borderRadius="md" 
              border="1px solid"
              borderColor={borderColor}
            >
              <Text fontSize={14} fontWeight="bold" color="purple.700">
                PERIODO ACADÉMICO {periodData.academic_period}
              </Text>
            </Box>

            <Box my={2} px={6} py={3} bg={summaryBg} borderRadius="md">
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  <strong>Total de Cursos:</strong> {periodData.total_courses}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Total Créditos:</strong> {periodData.courses.reduce((sum, course) => {
                    // Obtener créditos del primer schedule si existe
                    return sum + (course.schedules?.[0]?.credits || 0);
                  }, 0)}
                </Text>
              </HStack>
            </Box>

            <Box 
              bg={bgColor} 
              borderRadius="lg" 
              overflow="hidden" 
              border="1px solid" 
              borderColor={borderColor}
            >
              <Table.Root variant="simple" size="sm">
                <Table.Header bg={headerBg}>
                  <Table.Row >
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center">Ciclo</Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center" width="360px">Asignatura</Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center">Calificación</Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center">Créditos</Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center">Sección</Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center" width="320px">Docente</Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center" width="320px">Horario</Table.Cell>
                    <Table.Cell fontWeight="bold" color="blue.700" textAlign="center">Estado</Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {periodData.courses.map((course, index) => (
                    <Table.Row 
                      key={index} 
                      _hover={{ bg: hoverBg }}
                      borderColor={borderColor}
                      onClick={(e) => {
                        if (e.target.closest('button') || e.target.closest('a')) return;
                        handleRowClick(course)
                      }}
                      cursor="pointer"
                    >
                      <Table.Cell>
                        <Text fontSize="sm" color="blue.600" fontWeight="medium" textAlign="center">
                          {course.schedules?.[0]?.cycle || "N/A"}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" fontWeight="medium" color="blue.600">
                            {course.course_code} - {course.course_name}
                          </Text>
                          {course.is_repeated && (
                            <Badge colorScheme="orange" size="sm">
                              Repetido
                            </Badge>
                          )}
                        </VStack>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Badge 
                          bg={getGradeColor(course.final_grade)} 
                          variant="solid"
                          p={1}
                          boxSize={6}
                          textAlign={"center"}
                          justifyContent="center"
                          color="white"
                          borderRadius="md"
                        >
                          {course.final_grade || "N/A"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text fontSize="sm" fontWeight="medium">
                          {course.schedules?.[0]?.credits || "N/A"}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text fontSize="sm" fontWeight="medium">
                          {course.group_section}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm">
                          {course.teacher}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.600">
                          {formatSchedule(course.schedules)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {course.schedules?.[0] && (
                          <Badge 
                            colorScheme={course.schedules[0].status_review === 1 ? "green" : "orange"}
                            size="sm"
                          >
                            {course.schedules[0].status_review_display}
                          </Badge>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        ))}
      </VStack>
      )}
    </Box>
  );
};
