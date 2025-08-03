import { Encryptor } from "@/components/CrytoJS/Encryptor";
import { useColorModeValue } from "@/components/ui";
import { useReadMyCourses } from "@/hooks/mycourses"
import { 
  Box, 
  Heading, 
  Table, 
  Text, 
  Badge, 
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";

const CoursesListByPeriod = [
  {
    id: 1,
    student_id: 1,
    program_id: 2,
    program_name: "Maestría en Administración",
    program_period: "2025-1",
    enrollment_period_program: 1,
    status: 2,
    status_display: "Matriculado",
    payment_verified: true,
    is_first_enrollment: true,
    verified_at: "2025-07-17T16:04:20.478000-05:00",
    courses_enrolled: 4,
    total_credits: 16,
    courses: [
      {
        id: 1,
        course_id: 3,
        course_name: "Fundamentos de Administración",
        course_code: "ADM101",
        credits: 4,
        group_id: 5,
        group_code: "A1",
        teacher_id: 1,
        teacher_name: "Dr. Juan Pérez",
        average: 15,
        schedule_info: [
          {
            day_of_week: 1,
            start_time: "08:00",
            end_time: "12:00",
            total_hours: 4
          },
        ]
      },
      {
        id: 2,
        course_id: 4,
        course_name: "Gestión de Proyectos",
        course_code: "ADM201",
        credits: 4,
        group_id: 6,
        group_code: "B1",
        teacher_id: 2,
        teacher_name: "Dra. María López",
        average: 11,
        schedule_info: [
          {
            day_of_week: 3,
            start_time: "14:00",
            end_time: "18:00",
            total_hours: 4
          },
        ]
      },
      {
        id: 3,
        course_id: 5,
        course_name: "Contabilidad Financiera",
        course_code: "ADM301",
        credits: 4,
        group_id: 7,
        group_code: "C1",
        teacher_id: 3,
        teacher_name: "Lic. Ana Torres",
        average: 14,
        schedule_info: [
          {
            day_of_week: 5,
            start_time: "16:00",
            end_time: "20:00",
            total_hours: 4
          },
        ]
      }
    ]
  },
  {
    id: 2,
    student_id: 1,
    program_id: 2,
    program_name: "Maestría en Administración",
    program_period: "2025-2",
    enrollment_period_program: 2,
    status: 2,
    status_display: "Matriculado",
    payment_verified: true,
    is_first_enrollment: false,
    verified_at: "2026-01-15T10:30:00.000000-05:00",
    courses: [
      {
        id: 3,
        course_id: 5,
        course_name: "Marketing Estratégico",
        course_code: "MKT301",
        credits: 4,
        group_id: 7,
        group_code: "C1",
        teacher_id: 3,
        teacher_name: "Ing. Carlos García",
        average: 9,
        schedule_info: [
          {
            day_of_week: 2,
            start_time: "10:00",
            end_time: "14:00",
            total_hours: 4
          },
        ]
      },
      {
        id: 4,
        course_id: 6,
        course_name: "Finanzas Corporativas",
        course_code: "FIN401",
        credits: 4,
        group_id: 8,
        group_code: "D1",
        teacher_id: 4,
        teacher_name: "Lic. Ana Torres",
        average: 11,
        schedule_info: [
          {
            day_of_week: 5,
            start_time: "16:00",
            end_time: "20:00",
            total_hours: 4
          },
        ]
      }
    ]
  }
]

export const MyCoursesListByAcademicPeriodView = () => {
  const { // No funcional por ahora, debes usar CoursesListByPeriod
    data: myCourses,
    isLoading: isLoadingMyCourses
  } = useReadMyCourses();

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

  const formatSchedule = (scheduleInfo) => {
    if (!scheduleInfo || scheduleInfo.length === 0) return "Sin horario";
    
    return scheduleInfo.map(schedule => 
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

  return (
    <Box p={6} maxW="full" mx="auto">
      <Heading mb={3}>
        Mis Cursos
      </Heading>

      <VStack spacing={6} align="stretch">
        {CoursesListByPeriod.map((period) => (
          <Box key={period.id} mb={3}>
            <Box 
              bg={periodHeaderBg} 
              py={2}
              textAlign="center" 
              borderRadius="md" 
              border="1px solid"
              borderColor={borderColor}
            >
              <Text fontSize={14} fontWeight="bold" color="purple.700">
                PERIODO ACADÉMICO {period.program_period}
              </Text>
            </Box>

            <Box my={2} px={6} py={3} bg={summaryBg} borderRadius="md">
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  <strong>Programa:</strong> {period.program_name}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Cursos:</strong> {period.courses.length}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Total Créditos:</strong> {period.courses.reduce((sum, course) => sum + course.credits, 0)}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Estado:</strong> {period.status_display}
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
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {period.courses.map((course, index) => (
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
                          {period.enrollment_period_program}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" fontWeight="medium" color="blue.600">
                            {course.course_code} - {course.course_name}
                          </Text>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Badge 
                          bg={getGradeColor(course.average)} 
                          variant="solid"
                          p={1}
                          boxSize={6}
                          textAlign={"center"}
                          justifyContent="center"
                          color="white"
                          borderRadius="md"
                        >
                          {course.average}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text fontSize="sm" fontWeight="medium">
                          {course.credits}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text fontSize="sm" fontWeight="medium">
                          {course.group_code}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm">
                          {course.teacher_name}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.600">
                          {formatSchedule(course.schedule_info)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
