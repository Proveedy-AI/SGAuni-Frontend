import PropTypes from "prop-types";
import { Button, toaster, useColorModeValue } from "@/components/ui";
import { Badge, Box, Heading, HStack, Icon, Table, Text, VStack } from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import { 
  useCreateCourseSelection,
  useDeleteCourseSelection,
  useReadCourseGroupsById
} from "@/hooks/course-selections";

export const Step01CourseList = ({ 
  courses, 
  mySelections, 
  selectedCourse, 
  setSelectedCourse,
  onRefreshSelections
}) => {
  console.log('cursos elegibles', courses);
  console.log('selecciones', mySelections);
  const bgColor = useColorModeValue("white", "gray.800");
  
  const {
    data: courseGroups,
    isLoading: isLoadingGroups
  } = useReadCourseGroupsById(
    selectedCourse?.course_id,
    {},
    { enabled: !!selectedCourse }
  );

  console.log('groups', courseGroups);
  
  const { mutateAsync: createSelection, isPending: loadingGroupSelection } = useCreateCourseSelection();
  const { mutateAsync: removeSelection, isPending: loadingGroupRemoval } = useDeleteCourseSelection();

  const isGroupSelected = (groupId) => {
    return mySelections?.some(selection => selection.id === groupId) || false;
  };

  const handleSelectGroup = async (groupId) => {
    await createSelection(groupId, {
      onSuccess: () => {
        toaster.create({
          title: 'Grupo añadido a la matrícula',
          type: 'success',
        })
        onRefreshSelections()
      },
      onError: () => {
        toaster.create({
          title: 'Error al añadir el grupo',
          type: 'error',
        })
      }
    })
  };

  const handleRemoveGroup = async (groupId) => {
    await removeSelection(groupId, {
      onSuccess: () => {
        toaster.create({
          title: 'Grupo eliminado de la matrícula',
          type: 'success',
        })
        onRefreshSelections()
      },
      onError: () => {
        toaster.create({
          title: 'Error al eliminar el grupo',
          type: 'error',
        })
      }
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <Badge colorScheme="green" variant="subtle">Disponible</Badge>;
      case 'blocked':
        return <Badge colorScheme="red" variant="subtle">Bloqueado</Badge>;
      default:
        return <Badge colorScheme="gray" variant="subtle">Sin estado</Badge>;
    }
  };

  // Vista de lista de cursos
  if (!selectedCourse) {
    return (
      <Box>
        <HStack justify="space-between" mb={4}>
          <Text fontSize="lg" fontWeight="semibold">
            Listado de Cursos
          </Text>
          <Badge colorScheme="blue" fontSize="lg" px={4} py={2} borderRadius="full">
            {mySelections?.length || 0} cursos seleccionados
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
                <Table.Cell>Estado</Table.Cell>
                <Table.Cell textAlign="right">Acciones</Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {courses.map((course) => (
                <Table.Row key={course.course_id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{course.course_name}</Text>
                      <Text fontSize="sm" color="gray.500">{course.course_code}</Text>
                    </VStack>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>Ciclo {course.cycle}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{course.credits} créditos</Text>
                  </Table.Cell>
                  <Table.Cell>
                    {getStatusBadge(course.status)}
                    {course.status === 'blocked' && course.reasons?.length > 0 && (
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {course.reasons[0]}
                      </Text>
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button
                      bg="blue.600"
                      size="sm"
                      rightIcon={<Icon as={FiArrowRight} />}
                      onClick={() => setSelectedCourse(course)}
                      isDisabled={course.status === 'blocked'}
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

  return (
    <Box>
      <Button
        leftIcon={<Icon as={FiArrowLeft} />}
        variant="ghost"
        onClick={() => setSelectedCourse(null)}
        mb={4}
        bg="blue.500"
        color="white"
        _hover={{ bg: "blue.600" }}
      >
        Regresar a Listado de Cursos
      </Button>

      <Box mb={6}>
        <Heading as="h3" size="md" mb={2}>
          {selectedCourse.course_name}
        </Heading>
        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.600">Ciclo {selectedCourse.cycle}</Text>
          <Text fontSize="sm" color="gray.600">{selectedCourse.credits} créditos</Text>
          <Text fontSize="sm" color="gray.600">{selectedCourse.course_code}</Text>
        </HStack>
      </Box>

      {isLoadingGroups ? (
        <Box textAlign="center" py={8}>
          <Text>Cargando grupos...</Text>
        </Box>
      ) : (
        <Box bg={bgColor} borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200">
          <Table.Root variant="simple">
            <Table.Header bg="gray.50">
              <Table.Row>
                <Table.Cell>Sección</Table.Cell>
                <Table.Cell>Horario</Table.Cell>
                <Table.Cell>Docente</Table.Cell>
                <Table.Cell>Capacidad</Table.Cell>
                <Table.Cell>Estado</Table.Cell>
                <Table.Cell textAlign="right">Acciones</Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {courseGroups?.map((group) => {
                const isSelected = isGroupSelected(group.id);
                console.log(group);
                return (
                  <Table.Row key={group.id} _hover={{ bg: "gray.50" }}>
                    <Table.Cell>
                      <Text fontWeight="medium">{group.group_code}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <VStack align="start" spacing={1}>
                        {Array.isArray(group.schedule_info) && group.schedule_info?.map((schedule, index) => (
                          <Text key={index} fontSize="sm">
                            {schedule.day}: {schedule.duration}
                          </Text>
                        ))}
                        {(!group.schedule_info || !Array.isArray(group.schedule_info) || group.schedule_info.length === 0) && (
                          <Text fontSize="sm" color="gray.400">Sin horario</Text>
                        )}
                      </VStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize="sm">{group.teacher_name}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm">
                          {group.enrolled_count}/{group.capacity}
                        </Text>
                      </VStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge 
                        colorScheme={group.enrolled_count < group.capacity ? "green" : "red"} 
                        variant="subtle"
                        size="sm"
                      >
                        {group.enrolled_count < group.capacity ? "Disponible" : "Lleno"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      {isSelected ? (
                        <Button
                          bg="red"
                          size="sm"
                          leftIcon={<Icon as={FiX} />}
                          onClick={() => handleRemoveGroup(group.id)}
                          isLoading={loadingGroupRemoval === group.id}
                          isDisabled={loadingGroupRemoval === group.id}
                        >
                          Quitar
                        </Button>
                      ) : (
                        <Button
                          bg="green"
                          size="sm"
                          onClick={() => handleSelectGroup(group.id)}
                          isLoading={loadingGroupSelection === group.id}
                          isDisabled={group.enrolled_count >= group.capacity}
                        >
                          {group.enrolled_count >= group.capacity ? 'Lleno' : 'Seleccionar'}
                        </Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
};

Step01CourseList.propTypes = {
  courses: PropTypes.array.isRequired,
  mySelections: PropTypes.array,
  selectedCourse: PropTypes.object,
  setSelectedCourse: PropTypes.func.isRequired,
  onRefreshSelections: PropTypes.func.isRequired
};
