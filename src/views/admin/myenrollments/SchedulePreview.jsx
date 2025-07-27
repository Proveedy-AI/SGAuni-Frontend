import {
  Box,
  Card,
  Heading,
  Text,
  VStack,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { FiClock } from 'react-icons/fi';
import PropTypes from 'prop-types';

const DAYS = [
  { key: 'Lunes', label: 'Lunes' },
  { key: 'Martes', label: 'Martes' },
  { key: 'Miércoles', label: 'Miércoles' },
  { key: 'Jueves', label: 'Jueves' },
  { key: 'Viernes', label: 'Viernes' },
  { key: 'Sábado', label: 'Sábado' },
];

export const SchedulePreview = ({ courses }) => {
  // Agrupar cursos por día
  const coursesByDay = courses.reduce((acc, course) => {
    const day = course.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(course);
    return acc;
  }, {});

  const getCourseColor = (index) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'red', 'teal'];
    return colors[index % colors.length];
  };

  return (
    <Card.Root>
      <Card.Header>
        <HStack>
          <FiClock />
          <Heading size="md">Vista previa del horario</Heading>
        </HStack>
      </Card.Header>
      <Card.Body>
        {courses.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={4}>
            Selecciona cursos para ver tu horario
          </Text>
        ) : (
          <VStack gap={4} align="stretch">
            {DAYS.map(day => {
              const dayCourses = coursesByDay[day.key] || [];
              
              return (
                <Box key={day.key} borderWidth={1} borderRadius="md" p={3}>
                  <Text fontWeight="semibold" mb={2} color="gray.700">
                    {day.label}
                  </Text>
                  
                  {dayCourses.length === 0 ? (
                    <Text fontSize="sm" color="gray.400">
                      Sin clases
                    </Text>
                  ) : (
                    <VStack gap={2} align="stretch">
                      {dayCourses.map((course, index) => (
                        <Box
                          key={course.id}
                          bg={`${getCourseColor(index)}.50`}
                          borderLeft={`4px solid`}
                          borderLeftColor={`${getCourseColor(index)}.500`}
                          p={3}
                          borderRadius="md"
                        >
                          <VStack gap={1} align="start">
                            <Text fontWeight="semibold" fontSize="sm">
                              {course.course_name}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {course.course_group_code} - {course.teacher_name}
                            </Text>
                            <HStack gap={2}>
                              <Badge size="sm" colorPalette={getCourseColor(index)}>
                                {course.start_time} - {course.end_time}
                              </Badge>
                              <Badge size="sm" colorPalette="gray">
                                {course.credits} créd.
                              </Badge>
                            </HStack>
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              );
            })}
          </VStack>
        )}
      </Card.Body>
    </Card.Root>
  );
};

SchedulePreview.propTypes = {
  courses: PropTypes.array.isRequired,
};
