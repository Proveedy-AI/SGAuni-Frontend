import PropTypes from "prop-types";
import { Button, useColorModeValue } from "@/components/ui";
import { Alert, Badge, Box, Heading, HStack, Icon, Table, Text, VStack } from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";

// Componente combinado para cursos y horarios (Step 1)
export const Step01CourseList = ({ 
  courses, 
  selectedGroups, 
  onSelectGroup, 
  selectedCourse, 
  setSelectedCourse 
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  
  const getDayName = (dayNumber) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayNumber];
  };

  const formatTime = (time) => {
    return time.slice(0, 5);
  };

  const isGroupSelected = (groupId) => {
    return selectedGroups.some(sg => sg.id === groupId);
  };

  const checkTimeConflict = (group1, group2) => {
    if (group1.day_of_week !== group2.day_of_week) return false;
    
    const start1 = group1.start_time;
    const end1 = group1.end_time;
    const start2 = group2.start_time;
    const end2 = group2.end_time;
    
    return (start1 < end2 && start2 < end1);
  };

  const isGroupConflicting = (group) => {
    return selectedGroups.some(selectedGroup => 
      selectedGroup.id !== group.id && checkTimeConflict(group, selectedGroup)
    );
  };

  // Vista de lista de cursos
  if (!selectedCourse) {
    return (
      <Box>
        {/* Contador de cursos seleccionados */}
        <HStack justify="space-between" mb={4}>
          <Text fontSize="sm" color="gray.600">
            Listado de Cursos
          </Text>
          <Badge colorScheme="blue" fontSize="lg" px={4} py={2} borderRadius="full">
            {selectedGroups.length} cursos seleccionados
          </Badge>
        </HStack>

        {/* Tabla de cursos */}
        <Box bg={bgColor} borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200">
          <Table.Root variant="simple">
            <Table.Header bg="gray.50">
              <Table.Row>
                <Table.Cell>Curso</Table.Cell>
                <Table.Cell>Ciclo</Table.Cell>
                <Table.Cell>Créditos</Table.Cell>
                <Table.Cell textAlign="right">Acciones</Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {courses.map((course) => (
                <Table.Row key={course.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell>
                    <Text fontWeight="medium">{course.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>Ciclo {course.cycle}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>Créditos {course.credits}</Text>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button
                      bg="blue.600"
                      size="sm"
                      rightIcon={<Icon as={FiArrowRight} />}
                      onClick={() => setSelectedCourse(course)}
                    >
                      Ver horarios
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    );
  }

  // Vista de horarios del curso seleccionado
  return (
    <Box>
      <Button
        leftIcon={<Icon as={FiArrowLeft} />}
        variant="ghost"
        onClick={() => setSelectedCourse(null)}
        mb={4}
        color="blue.500"
      >
        Regresar a Listado de Cursos
      </Button>

      <Box mb={6}>
        <Heading as="h3" size="md" mb={2}>
          {selectedCourse.name}
        </Heading>
        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.600">Ciclo {selectedCourse.cycle}</Text>
          <Text fontSize="sm" color="gray.600">Créditos {selectedCourse.credits}</Text>
        </HStack>
      </Box>

      <Box bg={bgColor} borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200">
        <Table.Root variant="simple">
          <Table.Header bg="gray.50">
            <Table.Row>
              <Table.Cell>Sección</Table.Cell>
              <Table.Cell>Horario</Table.Cell>
              <Table.Cell>Docente</Table.Cell>
              <Table.Cell>Modalidad</Table.Cell>
              <Table.Cell textAlign="right">Acciones</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {selectedCourse.groups.map((group) => {
              const isSelected = isGroupSelected(group.id);
              const isConflicting = isGroupConflicting(group);
              
              return (
                <Table.Row key={group.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell>
                    <Text fontWeight="medium">{group.course_group_code}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm">
                        {getDayName(group.day_of_week)}: {formatTime(group.start_time)} - {formatTime(group.end_time)}
                      </Text>
                    </VStack>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm">{group.teacher}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme="blue" variant="subtle">
                      Presencial
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {isSelected ? (
                      <Button
                        colorScheme="red"
                        size="sm"
                        leftIcon={<Icon as={FiX} />}
                        onClick={() => onSelectGroup(group, selectedCourse, 'remove')}
                      >
                        Quitar
                      </Button>
                    ) : (
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => onSelectGroup(group, selectedCourse, 'add')}
                        isDisabled={isConflicting}
                      >
                        {isConflicting ? 'Cruce de horario' : 'Seleccionar'}
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>

      {selectedCourse.groups.some(group => isGroupConflicting(group)) && (
        <Alert status="warning" mt={4} borderRadius="md">
          <Text fontSize="sm">
            Algunos horarios están deshabilitados debido a cruces de horario con tus selecciones actuales.
          </Text>
        </Alert>
      )}
    </Box>
  );
};

Step01CourseList.propTypes = {
  courses: PropTypes.array.isRequired,
  selectedGroups: PropTypes.array.isRequired,
  onSelectGroup: PropTypes.func.isRequired,
  selectedCourse: PropTypes.object,
  setSelectedCourse: PropTypes.func.isRequired
};
