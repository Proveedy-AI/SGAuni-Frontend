import PropTypes from 'prop-types';
import { memo } from 'react';
import { Box, Table, Text, Badge, Group } from '@chakra-ui/react';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { RegisterEvaluationsModal } from '@/components/modals/myclasses';

const Row = memo(({ fetchData, student, evaluationComponents, statusOptions, statusColors }) => {
  const statusOption = statusOptions.find(opt => opt.value === student.qualification_status);
  const statusColor = statusColors.find(c => c.id === student.qualification_status) || { bg: 'gray.200', color: 'gray.800' };

  return (
    <Table.Row key={student.uuid} bg={{ base: 'white', _dark: 'its.gray.500' }}>
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
            {student?.final_grade}
          </Text>
        </Table.Cell>
      )}
      <Table.Cell>
        <Group>
          <RegisterEvaluationsModal fetchData={fetchData} student={student} evaluationComponents={evaluationComponents} />
        </Group>
      </Table.Cell>
    </Table.Row>
  );
});

Row.displayName = 'StudentRow';

Row.propTypes = {
  fetchData: PropTypes.func,
  student: PropTypes.object.isRequired,
  evaluationComponents: PropTypes.array,
  statusOptions: PropTypes.array.isRequired,
  statusColors: PropTypes.array.isRequired,
};

export const StudentsEvaluationsTable = ({ 
  fetchData,
  students, 
  evaluationComponents,
  isLoading,
  hasConfiguration
}) => {
  const statusOptions = [
    { value: 1, label: 'En Curso' },
    { value: 2, label: 'Parcialmente calificado' },
    { value: 3, label: 'Totalmente calificado' },
    { value: 4, label: 'Aprobado' },
    { value: 5, label: 'Reprobado' },
  ];

  const statusColors = [
    { id: 1, bg: '#AEAEAE', color: '#F5F5F5' },
    { id: 2, bg: '#FDD9C6', color: '#F86A1E' },
    { id: 3, bg: '#C0D7F5', color: '#0661D8' },
    { id: 4, bg: '#D0EDD0', color: '#2D9F2D' },
    { id: 5, bg: '#F7CDCE', color: '#E0383B' },
  ];

  const getColumnCount = () => {
    let baseColumns = 4; // ID, Nombre, Estado
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
              <Table.ColumnHeader w='8%'>Código</Table.ColumnHeader>
              <Table.ColumnHeader w='25%'>Nombre</Table.ColumnHeader>
              <Table.ColumnHeader w='15%'>Estado</Table.ColumnHeader>
              {/* Columnas dinámicas para evaluaciones */}
              {evaluationComponents?.map((evaluation) => (
                <Table.ColumnHeader key={evaluation.id} textAlign="center" w='10%'>
                  {evaluation.name}
                </Table.ColumnHeader>
              ))}
              <Table.ColumnHeader textAlign="center" w='12%'>Promedio</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" w='12%'>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <SkeletonTable columns={getColumnCount()} />
            ) : students && students.length > 0 ? (
              students.map((student) => (
                <Row
                  key={student.uuid || student.id}
                  fetchData={fetchData}
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
  fetchData: PropTypes.func,
  students: PropTypes.array,
  evaluationComponents: PropTypes.array,
  isLoading: PropTypes.bool,
  hasConfiguration: PropTypes.bool.isRequired,
};
