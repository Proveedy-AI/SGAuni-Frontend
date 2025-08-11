import PropTypes from 'prop-types';
import { memo } from 'react';
import { Box, Table, Text, Badge } from '@chakra-ui/react';
import SkeletonTable from '@/components/ui/SkeletonTable';

const Row = memo(({ student, evaluationComponents, statusOptions, statusColors }) => {
  const statusOption = statusOptions.find(opt => opt.value === student.qualification_status);
  const statusColor = statusColors.find(c => c.id === student.qualification_status) || { bg: 'gray.200', color: 'gray.800' };

  return (
    <Table.Row key={student.uuid || student.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
      <Table.Cell>
        { student?.student_code }
      </Table.Cell>
      <Table.Cell>
        <Text fontWeight="medium">{student.student_name}</Text>
      </Table.Cell>
      <Table.Cell>
        <Badge
          px={2}
          py={1}
          borderRadius='md'
          fontWeight='bold'
          bg={statusColor.bg}
          color={statusColor.color}
        >
          {statusOption?.label || student.qualification_status_display || 'Desconocido'}
        </Badge>
      </Table.Cell>
      {/* Columnas de evaluaciones */}
      {evaluationComponents?.map((evaluation) => (
        <Table.Cell key={evaluation.id} textAlign="center">
          <Text fontWeight="medium">
            {student.califications?.find(c => c.evaluation_component === evaluation.id)?.grade || '-'}
          </Text>
        </Table.Cell>
      ))}
      {/* Columna de promedio */}
      {evaluationComponents && evaluationComponents.length > 0 && (
        <Table.Cell textAlign="center">
          <Text fontWeight="bold" color={(student.final_grade || 0) >= 11 ? "green.600" : "red.600"}>
            {student.final_grade ? student.final_grade.toFixed(2) : '0.00'}
          </Text>
        </Table.Cell>
      )}
    </Table.Row>
  );
});

Row.displayName = 'StudentRow';

Row.propTypes = {
  student: PropTypes.object.isRequired,
  evaluationComponents: PropTypes.array,
  statusOptions: PropTypes.array.isRequired,
  statusColors: PropTypes.array.isRequired,
};

export const StudentsEvaluationsTable = ({ 
  students, 
  evaluationComponents,
  isLoading,
  hasConfiguration
}) => {
  const statusOptions = [
    { value: 1, label: 'En Curso' },
    { value: 2, label: 'Calificado' },
    { value: 3, label: 'No Calificado' },
    { value: 4, label: 'Aprobado' },
    { value: 5, label: 'Reprobado' },
  ];

  // const studentsLocal = [
  // {
  //   "student_code": "2021001",
  //   "student_name": "German Emilio Rodríguez",
  //   "uuid": "6b004087-67a4-498f-8c85-ede9417e0888",
  //   "student_email": "german.rodriguez@universidad.edu",
  //   "final_grade": 15.75,
  //   "qualification_status": 1,
  //   "qualification_status_display": "En curso",
  //   "califications": [
  //     {
  //       "id": 1,
  //       "enrollment_course_selection": 101,
  //       "evaluation_component": 1,
  //       "evaluation_component_name": "Examen Parcial 1",
  //       "grade": "16",
  //       "grade_conceptual": "A",
  //       "graded_at": "2025-03-15T14:30:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     },
  //     {
  //       "id": 2,
  //       "enrollment_course_selection": 101,
  //       "evaluation_component": 2,
  //       "evaluation_component_name": "Trabajo Grupal",
  //       "grade": "18",
  //       "grade_conceptual": "AD",
  //       "graded_at": "2025-04-10T16:45:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     },
  //     {
  //       "id": 3,
  //       "enrollment_course_selection": 101,
  //       "evaluation_component": 3,
  //       "evaluation_component_name": "Examen Parcial 2",
  //       "grade": "14",
  //       "grade_conceptual": "B",
  //       "graded_at": "2025-05-20T10:15:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     }
  //   ]
  // },
  // {
  //   "student_code": "2021002",
  //   "student_name": "María Elena González",
  //   "uuid": "7c115198-78b5-509f-9d96-fef0518f1b99",
  //   "student_email": "maria.gonzalez@universidad.edu",
  //   "final_grade": 12.50,
  //   "qualification_status": 2,
  //   "qualification_status_display": "Calificado",
  //   "califications": [
  //     {
  //       "id": 4,
  //       "enrollment_course_selection": 102,
  //       "evaluation_component": 1,
  //       "evaluation_component_name": "Examen Parcial 1",
  //       "grade": "13",
  //       "grade_conceptual": "B",
  //       "graded_at": "2025-03-15T14:30:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     },
  //     {
  //       "id": 5,
  //       "enrollment_course_selection": 102,
  //       "evaluation_component": 2,
  //       "evaluation_component_name": "Trabajo Grupal",
  //       "grade": "15",
  //       "grade_conceptual": "A",
  //       "graded_at": "2025-04-10T16:45:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     },
  //     {
  //       "id": 6,
  //       "enrollment_course_selection": 102,
  //       "evaluation_component": 3,
  //       "evaluation_component_name": "Examen Parcial 2",
  //       "grade": "10",
  //       "grade_conceptual": "C",
  //       "graded_at": "2025-05-20T10:15:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     }
  //   ]
  // },
  // {
  //   "student_code": "2021003",
  //   "student_name": "Carlos Alberto Ruiz",
  //   "uuid": "8d226209-89c6-610g-ae07-0f152940c2aa",
  //   "student_email": "carlos.ruiz@universidad.edu",
  //   "final_grade": 17.25,
  //   "qualification_status": 4,
  //   "qualification_status_display": "Aprobado",
  //   "califications": [
  //     {
  //       "id": 7,
  //       "enrollment_course_selection": 103,
  //       "evaluation_component": 1,
  //       "evaluation_component_name": "Examen Parcial 1",
  //       "grade": "18",
  //       "grade_conceptual": "AD",
  //       "graded_at": "2025-03-15T14:30:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     },
  //     {
  //       "id": 8,
  //       "enrollment_course_selection": 103,
  //       "evaluation_component": 2,
  //       "evaluation_component_name": "Trabajo Grupal",
  //       "grade": "17",
  //       "grade_conceptual": "A",
  //       "graded_at": "2025-04-10T16:45:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     },
  //     {
  //       "id": 9,
  //       "enrollment_course_selection": 103,
  //       "evaluation_component": 3,
  //       "evaluation_component_name": "Examen Parcial 2",
  //       "grade": "17",
  //       "grade_conceptual": "A",
  //       "graded_at": "2025-05-20T10:15:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     },
  //     {
  //       "id": 10,
  //       "enrollment_course_selection": 103,
  //       "evaluation_component": 4,
  //       "evaluation_component_name": "Proyecto Final",
  //       "grade": "17",
  //       "grade_conceptual": "A",
  //       "graded_at": "2025-06-25T11:30:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     }
  //   ]
  // },
  // {
  //   "student_code": "2021004",
  //   "student_name": "Ana Patricia Torres",
  //   "uuid": "9e337310-9ad7-721h-bf18-102630514bb",
  //   "student_email": "ana.torres@universidad.edu",
  //   "final_grade": null,
  //   "qualification_status": 3,
  //   "qualification_status_display": "No Calificado",
  //   "califications": []
  // },
  // {
  //   "student_code": "2021005",
  //   "student_name": "Luis Fernando Morales",
  //   "uuid": "af448421-abc8-832i-cg29-213741625cc",
  //   "student_email": "luis.morales@universidad.edu",
  //   "final_grade": 9.75,
  //   "qualification_status": 5,
  //   "qualification_status_display": "Reprobado",
  //   "califications": [
  //     {
  //       "id": 11,
  //       "enrollment_course_selection": 105,
  //       "evaluation_component": 1,
  //       "evaluation_component_name": "Examen Parcial 1",
  //       "grade": "8",
  //       "grade_conceptual": "C",
  //       "graded_at": "2025-03-15T14:30:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     },
  //     {
  //       "id": 12,
  //       "enrollment_course_selection": 105,
  //       "evaluation_component": 2,
  //       "evaluation_component_name": "Trabajo Grupal",
  //       "grade": "12",
  //       "grade_conceptual": "B",
  //       "graded_at": "2025-04-10T16:45:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     },
  //     {
  //       "id": 13,
  //       "enrollment_course_selection": 105,
  //       "evaluation_component": 3,
  //       "evaluation_component_name": "Examen Parcial 2",
  //       "grade": "9",
  //       "grade_conceptual": "C",
  //       "graded_at": "2025-05-20T10:15:00.000Z",
  //       "graded_by": "Dr. Juan Pérez"
  //     }
  //   ]
  // }
  // ];

  const statusColors = [
    { id: 1, bg: '#AEAEAE', color: '#F5F5F5' },
    { id: 2, bg: '#C0D7F5', color: '#0661D8' },
    { id: 3, bg: '#FDD9C6', color: '#F86A1E' },
    { id: 4, bg: '#D0EDD0', color: '#2D9F2D' },
    { id: 5, bg: '#F7CDCE', color: '#E0383B' },
  ];

  const getColumnCount = () => {
    let baseColumns = 3; // ID, Nombre, Estado
    if (hasConfiguration && evaluationComponents) {
      baseColumns += evaluationComponents.length + 1; // evaluaciones + promedio
    }
    return baseColumns;
  };

  if (!hasConfiguration) {
    return (
      <Box
        bg={{ base: 'white', _dark: 'its.gray.500' }}
        p='3'
        borderRadius='10px'
        overflow='hidden'
        boxShadow='md'
        display="flex"
        flexDirection="row"
      >
        <Table.ScrollArea flex={1}>
          <Table.Root size='sm' w='full' striped>
            <Table.Header>
              <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
                <Table.ColumnHeader w='10%'>
                  <Text fontWeight="bold">ID</Text>
                </Table.ColumnHeader>
                <Table.ColumnHeader w='50%'>
                  <Text fontWeight="bold">Nombre</Text>
                </Table.ColumnHeader>
                <Table.ColumnHeader w='40%'>
                  <Text fontWeight="bold">Estado</Text>
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <SkeletonTable columns={3} />
              ) : students && students.length > 0 ? (
                students.map((student) => (
                  <Row
                    key={student.uuid || student.id}
                    student={student}
                    evaluationComponents={[]}
                    statusOptions={statusOptions}
                    statusColors={statusColors}
                  />
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={3} textAlign='center' py={4}>
                    <Text color="gray.500">No hay estudiantes registrados en este curso</Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
        
        {/* Panel lateral cuando no hay configuración */}
        <Box 
          textAlign='center' 
          bg='blue.100' 
          p={4} 
          borderRadius='md'
          minW="200px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontWeight='bold' color='blue.700' mb={2}>
            Configura las evaluaciones del curso
          </Text>
          <img
            src='/img/withoutConfigurationExam.webp'
            alt='Sin configuración de evaluaciones'
            style={{ maxWidth: '120px', margin: '0 auto' }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      bg={{ base: 'white', _dark: 'its.gray.500' }}
      p='3'
      borderRadius='10px'
      overflow='hidden'
      boxShadow='md'
    >
      <Table.ScrollArea>
        <Table.Root size='sm' w='full' striped>
          <Table.Header>
            <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
              <Table.ColumnHeader w='8%'>
                <Text fontWeight="bold">Código</Text>
              </Table.ColumnHeader>
              <Table.ColumnHeader w='25%'>
                <Text fontWeight="bold">Nombre</Text>
              </Table.ColumnHeader>
              <Table.ColumnHeader w='15%'>
                <Text fontWeight="bold">Estado</Text>
              </Table.ColumnHeader>
              {/* Columnas dinámicas para evaluaciones */}
              {evaluationComponents?.map((evaluation) => (
                <Table.ColumnHeader key={evaluation.id} textAlign="center" w='10%'>
                  <Text fontWeight="bold" fontSize="sm">{evaluation.name}</Text>
                </Table.ColumnHeader>
              ))}
              <Table.ColumnHeader textAlign="center" w='12%'>
                <Text fontWeight="bold">Promedio</Text>
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <SkeletonTable columns={getColumnCount()} />
            ) : students && students.length > 0 ? (
              students.map((student) => (
                <Row
                  key={student.uuid || student.id}
                  student={student}
                  evaluationComponents={evaluationComponents}
                  statusOptions={statusOptions}
                  statusColors={statusColors}
                />
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={getColumnCount()} textAlign='center' py={4}>
                  <Text color="gray.500">No hay estudiantes registrados en este curso</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
};

StudentsEvaluationsTable.propTypes = {
  students: PropTypes.array,
  evaluationComponents: PropTypes.array,
  isLoading: PropTypes.bool,
  hasConfiguration: PropTypes.bool.isRequired,
};
