import PropTypes from "prop-types";
import { Box, Heading, Text, Grid } from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui";

export const Step02ShowSchedule = ({ selectedGroups }) => {
  console.log(selectedGroups);
  // Arrays de tiempo y días de la semana (igual que en ScheduleEnrollmentProgramsModal)
  const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  // Mapeo de números de día a nombres (1 = Lunes, 2 = Martes, etc.)
  const dayNumberToName = {
    1: 'Lunes',
    2: 'Martes', 
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado'
  };

  // Color modes - llamados en el nivel superior del componente
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const courseBg = useColorModeValue('blue.100', 'blue.800');
  const courseBorderColor = useColorModeValue('blue.400', 'blue.300');
  const courseHoverBg = useColorModeValue('blue.200', 'blue.700');
  
  // Función para obtener cursos para un slot de tiempo específico
  const getCourseForTimeSlot = (day, time) => {
    return selectedGroups.filter((course) => {
      const courseDayName = dayNumberToName[course.day_of_week];
      if (courseDayName !== day) return false;
      
      const courseStart = Number.parseInt(course.start_time.split(':')[0]);
      const courseEnd = Number.parseInt(course.end_time.split(':')[0]);
      const slotTime = Number.parseInt(time.split(':')[0]);
      
      return slotTime >= courseStart && slotTime < courseEnd;
    });
  };

  // Función para calcular la altura del curso
  const getCourseHeight = (course) => {
    const start = Number.parseInt(course.start_time.split(':')[0]);
    const end = Number.parseInt(course.end_time.split(':')[0]);
    return (end - start) * 48; // 48px por hora
  };

  return (
    <Box>
      <Heading as="h2" size="lg" mb={6}>Horario de Clases</Heading>
      
      <Box overflowX='auto'>
        <Box minW='800px'>
          {/* Header con días */}
          <Grid templateColumns='auto repeat(6, 1fr)' gap={1} mb={2}>
            <Box p={2} textAlign='center' fontWeight='medium' fontSize='sm'>
              Hora
            </Box>
            {daysOfWeek.map((day) => (
              <Box
                key={day}
                p={2}
                textAlign='center'
                fontWeight='medium'
                fontSize='sm'
                bg={headerBg}
                rounded='md'
              >
                {day}
              </Box>
            ))}
          </Grid>

          {/* Grid del calendario */}
          {timeSlots.map((time) => (
            <Grid key={time} templateColumns='auto repeat(6, 1fr)' gap={1}>
              <Box
                p={2}
                fontSize='xs'
                color='gray.500'
                textAlign='center'
                borderRight='1px'
                borderColor='gray.200'
              >
                {time}
              </Box>

              {daysOfWeek.map((day) => {
                const courses = getCourseForTimeSlot(day, time);

                return (
                  <Box
                    key={`${day}-${time}`}
                    position='relative'
                    h='48px'
                    border='1px solid'
                    borderColor='gray.50'
                  >
                    {courses.map((course, index) => {
                      const isFirstSlotOfCourse = course.start_time.startsWith(
                        time.split(':')[0]
                      );
                      if (!isFirstSlotOfCourse) return null;

                      const totalCourses = courses.length;
                      const width = `${100 / totalCourses}%`;
                      const left = `${(100 / totalCourses) * index}%`;

                      return (
                        <Box
                          key={course.id}
                          position='absolute'
                          top={0}
                          left={left}
                          width={width}
                          p={1}
                          rounded='md'
                          overflow='hidden'
                          bg={courseBg}
                          borderLeftColor={courseBorderColor}
                          borderLeft='4px solid'
                          height={`${getCourseHeight(course)}px`}
                          transition='all 0.2s ease-in-out'
                          cursor='pointer'
                          _hover={{
                            zIndex: 10,
                            transform: 'scale(1.1)',
                            boxShadow: 'xl',
                            width: '100%',
                            left: index === totalCourses - 1 ? 'auto' : left,
                            right: index === totalCourses - 1 ? '0' : 'auto',
                            bg: courseHoverBg,
                          }}
                        >
                          <Text fontWeight='medium' fontSize='xs' noOfLines={1}>
                            {course.courseName}
                          </Text>
                          <Text fontSize='xs' color='gray.600' noOfLines={1}>
                            {course.course_group_code}
                          </Text>
                          <Text fontSize='xs' color='gray.500' noOfLines={1}>
                            {course.teacher}
                          </Text>
                          <Text fontSize='xs' color='gray.500' noOfLines={1}>
                            {course.start_time.slice(0, 5)} - {course.end_time.slice(0, 5)}
                          </Text>
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Grid>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

Step02ShowSchedule.propTypes = {
  selectedGroups: PropTypes.array.isRequired,
};