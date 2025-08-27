import {
  Box,
  Card,
  Heading,
  Text,
  Table,
  Button,
  HStack,
  VStack,
  Badge,
  Alert,
  Icon,
  Checkbox,
  Separator,
  Grid,
} from '@chakra-ui/react';
import { useState, useEffect, useMemo } from 'react';
import { FiCalendar, FiClock, FiUser, FiAlertTriangle, FiCheckCircle, FiShoppingCart } from 'react-icons/fi';
import { useReadMyEnrollments } from '@/hooks/person/useReadMyEnrollments';
import { useCreateStudentEnrollment } from '@/hooks/person/useCreateStudentEnrollment';
import { useReadMyEnrolledCourses } from '@/hooks/person/useReadMyEnrolledCourses';
import { useReadCourseSchedule } from '@/hooks/enrollments_programs/schedule/useReadCourseSchedule';
import { useReadMyDebtsPayment } from '@/hooks/payment_orders/useReadMyDebtsPayment';
import { toaster } from '@/components/ui';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SchedulePreview } from './SchedulePreview';

export const MyEnrollments = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);

  const { data: myEnrollments, isLoading: isLoadingEnrollments, refetch: refetchEnrollments } = useReadMyEnrollments();

  //console.log(myEnrollments);
  
  const { data: myDebts, isLoading: isLoadingDebts } = useReadMyDebtsPayment();

  const activeEnrollment = useMemo(() => {
    return myEnrollments?.find(enrollment => 
      enrollment.status === 1 || enrollment.status === 2
    );
  }, [myEnrollments]);

  
  // Hook para crear inscripción
  const { mutate: createEnrollment, isPending: isCreatingEnrollment } = useCreateStudentEnrollment();

  // Obtener cursos disponibles para la matriculación activa
  const { data: availableCourses, isLoading: isLoadingCourses } = useReadCourseSchedule(
    { enrollment_period_program_course: activeEnrollment?.enrollment_period_program },
    { enabled: !!activeEnrollment }
  );

  // Obtener cursos ya inscritos
  const { data: enrolledCourses } = useReadMyEnrolledCourses(
    activeEnrollment?.enrollment_period_program,
    { enabled: !!activeEnrollment }
  );



  const flatCourses = useMemo(() => {
    const allCourses = availableCourses?.pages?.flatMap(page => page.results) || [];
    const enrolledCourseIds = enrolledCourses?.map(course => course.course_schedule_id) || [];
    
    // Filtrar cursos ya inscritos
    return allCourses.filter(course => !enrolledCourseIds.includes(course.id));
  }, [availableCourses, enrolledCourses]);

  // Verificar si el estudiante puede matricularse
  const canEnroll = useMemo(() => {
    if (!activeEnrollment) return false;
    
    // Verificar fecha de inicio
    const now = new Date();
    const startDate = new Date(activeEnrollment.registration_start_date);
    const endDate = new Date(activeEnrollment.registration_end_date);
    
    const isDateValid = now >= startDate && now <= endDate;
    
    // Verificar pago (sin deudas pendientes)
    const hasPayment = activeEnrollment.payment_verified || !myDebts?.length;
    
    return isDateValid && hasPayment;
  }, [activeEnrollment, myDebts]);

  // Calcular créditos totales seleccionados
  useEffect(() => {
    const total = selectedCourses.reduce((sum, courseId) => {
      const course = flatCourses.find(c => c.id === courseId);
      return sum + (course?.credits || 0);
    }, 0);
    setTotalCredits(total);
  }, [selectedCourses, flatCourses]);

  // Manejar selección de cursos con validaciones
  const handleCourseSelection = (courseId, isSelected) => {
    const course = flatCourses.find(c => c.id === courseId);
    
    if (isSelected) {
      // Verificar conflictos de horario
      const hasTimeConflict = selectedCourses.some(selectedId => {
        const selectedCourse = flatCourses.find(c => c.id === selectedId);
        return selectedCourse && 
               selectedCourse.day_of_week === course.day_of_week &&
               ((course.start_time >= selectedCourse.start_time && course.start_time < selectedCourse.end_time) ||
                (course.end_time > selectedCourse.start_time && course.end_time <= selectedCourse.end_time) ||
                (course.start_time <= selectedCourse.start_time && course.end_time >= selectedCourse.end_time));
      });

      if (hasTimeConflict) {
        toaster.create({
          title: 'Conflicto de horario',
          description: 'Este curso tiene conflicto de horario con otro curso seleccionado',
          type: 'warning',
        });
        return;
      }

      // Verificar límite de créditos (ejemplo: máximo 22 créditos)
      const newTotal = totalCredits + course.credits;
      if (newTotal > 22) {
        toaster.create({
          title: 'Límite de créditos excedido',
          description: `No puedes exceder 22 créditos por semestre. Total actual: ${newTotal}`,
          type: 'warning',
        });
        return;
      }

      setSelectedCourses(prev => [...prev, courseId]);
    } else {
      setSelectedCourses(prev => prev.filter(id => id !== courseId));
    }
  };

  // Confirmar inscripción
  const handleConfirmEnrollment = () => {
    if (selectedCourses.length === 0) {
      toaster.create({
        title: 'Selecciona al menos un curso',
        type: 'warning',
      });
      return;
    }

    const payload = {
      enrollment_period_program: activeEnrollment.enrollment_period_program,
      course_schedule_ids: selectedCourses
    };

    createEnrollment(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Inscripción confirmada exitosamente',
          description: `Te has inscrito en ${selectedCourses.length} curso(s) con un total de ${totalCredits} créditos`,
          type: 'success',
        });
        
        // Limpiar selección y refrescar datos
        setSelectedCourses([]);
        refetchEnrollments();
      },
      onError: (error) => {
        toaster.create({
          title: 'Error al confirmar inscripción',
          description: error.message || 'No se pudo completar la inscripción',
          type: 'error',
        });
      }
    });
  };

  // Estados de carga
  if (isLoadingEnrollments || isLoadingDebts) {
    return (
      <Box p={6}>
        <Text>Cargando información de matriculación...</Text>
      </Box>
    );
  }

  // Sin matriculaciones activas
  if (!activeEnrollment) {
    return (
      <Box p={6}>
        <Alert status="info">
          <Icon as={FiAlertTriangle} />
          <Text>No tienes matriculaciones disponibles en este momento.</Text>
        </Alert>
      </Box>
    );
  }

  // Verificar si puede matricularse
  if (!canEnroll) {
    const now = new Date();
    const startDate = new Date(activeEnrollment.registration_start_date);
    const endDate = new Date(activeEnrollment.registration_end_date);
    const isDateValid = now >= startDate && now <= endDate;
    
    return (
      <Box p={6}>
        <VStack gap={4} align="stretch">
          <Heading size="lg">Proceso de Matrícula</Heading>
          
          <Card.Root bg="orange.50" borderColor="orange.200">
            <Card.Body>
              <VStack gap={3} align="start">
                <HStack>
                  <Icon as={FiAlertTriangle} color="orange.500" />
                  <Text fontWeight="semibold" color="orange.700">
                    Matrícula no habilitada
                  </Text>
                </HStack>
                
                {/* {!isDateValid && (
                  <Text color="orange.600">
                    La matrícula para el programa <strong>{activeEnrollment.program_period}</strong> 
                    {now < startDate 
                      ? ` iniciará el ${format(startDate, 'dd/MM/yyyy', { locale: es })} a las ${format(startDate, 'HH:mm', { locale: es })}`
                      : ` finalizó el ${format(endDate, 'dd/MM/yyyy', { locale: es })}`
                    }
                  </Text>
                )} */}
                
                {myDebts?.length > 0 && (
                  <Text color="orange.600">
                    Debes completar el pago de matrícula antes de poder inscribirte en cursos.
                  </Text>
                )}
              </VStack>
            </Card.Body>
          </Card.Root>
          
          {/* Información del programa */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Información del Programa</Heading>
            </Card.Header>
            <Card.Body>
              <VStack gap={2} align="start">
                <Text><strong>Programa:</strong> {activeEnrollment.program_period}</Text>
                <Text><strong>Período:</strong> {activeEnrollment.program_period}</Text>
                {/* <Text>
                  <strong>Fecha de inscripción:</strong> 
                  {format(startDate, 'dd/MM/yyyy', { locale: es })} - {format(endDate, 'dd/MM/yyyy', { locale: es })}
                </Text> */}
                <Badge colorPalette={activeEnrollment.payment_verified ? 'green' : 'red'}>
                  {activeEnrollment.payment_verified ? 'Pago verificado' : 'Pago pendiente'}
                </Badge>
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack gap={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Heading size="lg">Proceso de Matrícula</Heading>
          <Badge colorPalette="green" size="lg">
            <Icon as={FiCheckCircle} mr={2} />
            Matrícula Habilitada
          </Badge>
        </HStack>

        {/* Información del programa */}
        <Card.Root bg="blue.50" borderColor="blue.200">
          <Card.Body>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={4}>
              <VStack align="start">
                <Text fontSize="sm" color="blue.600">Programa</Text>
                <Text fontWeight="semibold">{activeEnrollment.program_period}</Text>
              </VStack>
              <VStack align="start">
                <Text fontSize="sm" color="blue.600">Período de Inscripción</Text>
                <Text fontWeight="semibold">
                  {/* {format(new Date(activeEnrollment.registration_start_date), 'dd/MM/yyyy', { locale: es })} - 
                  {format(new Date(activeEnrollment.registration_end_date), 'dd/MM/yyyy', { locale: es })} */}
                </Text>
              </VStack>
              <VStack align="start">
                <Text fontSize="sm" color="blue.600">Estado de Pago</Text>
                <Badge colorPalette="green">Verificado</Badge>
              </VStack>
            </Grid>
          </Card.Body>
        </Card.Root>

        {/* Cursos ya inscritos */}
        {enrolledCourses && enrolledCourses.length > 0 && (
          <Card.Root bg="green.50" borderColor="green.200">
            <Card.Header>
              <HStack>
                <Icon as={FiCheckCircle} color="green.600" />
                <Heading size="md" color="green.700">Cursos Inscritos</Heading>
              </HStack>
            </Card.Header>
            <Card.Body>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={3}>
                {enrolledCourses.map((course) => (
                  <Box
                    key={course.id}
                    p={3}
                    bg="white"
                    borderRadius="md"
                    borderWidth={1}
                    borderColor="green.200"
                  >
                    <VStack align="start" gap={1}>
                      <Text fontWeight="semibold" fontSize="sm">{course.course_name}</Text>
                      <Text fontSize="xs" color="gray.600">{course.course_group_code}</Text>
                      <HStack gap={2}>
                        <Badge size="sm" colorPalette="green">{course.credits} créd.</Badge>
                        <Badge size="sm" colorPalette="blue">{course.day_of_week}</Badge>
                      </HStack>
                      <Text fontSize="xs" color="gray.500">
                        {course.start_time} - {course.end_time}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </Grid>
            </Card.Body>
          </Card.Root>
        )}

        {/* Carrito de compras */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr 1fr' }} gap={6}>
          {/* Lista de cursos disponibles */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Cursos Disponibles</Heading>
            </Card.Header>
            <Card.Body>
              {isLoadingCourses ? (
                <Text>Cargando cursos...</Text>
              ) : flatCourses.length === 0 ? (
                <Text color="gray.500">No hay cursos disponibles</Text>
              ) : (
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Seleccionar</Table.ColumnHeader>
                      <Table.ColumnHeader>Curso</Table.ColumnHeader>
                      <Table.ColumnHeader>Código</Table.ColumnHeader>
                      <Table.ColumnHeader>Docente</Table.ColumnHeader>
                      <Table.ColumnHeader>Horario</Table.ColumnHeader>
                      <Table.ColumnHeader>Créditos</Table.ColumnHeader>
                      <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                      <Table.ColumnHeader>Ciclo</Table.ColumnHeader>
                      <Table.ColumnHeader>Capacidad</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {flatCourses.map((course) => {
                      const isSelected = selectedCourses.includes(course.id);
                      return (
                        <Table.Row 
                          key={course.id}
                          bg={isSelected ? 'blue.50' : 'transparent'}
                          _hover={{ bg: 'gray.50' }}
                        >
                          <Table.Cell>
                            <Checkbox
                              checked={isSelected}
                              onChange={(e) => handleCourseSelection(course.id, e.target.checked)}
                              disabled={course.status_review !== 1} // Solo cursos aprobados
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <VStack align="start" gap={1}>
                              <Text fontWeight="semibold" fontSize="sm">{course.course_name}</Text>
                              <HStack gap={2}>
                                <Icon as={FiCalendar} size="xs" color="gray.500" />
                                <Text fontSize="xs" color="gray.500">{course.day_of_week}</Text>
                              </HStack>
                            </VStack>
                          </Table.Cell>
                          <Table.Cell>
                            <Text fontSize="sm">{course.course_group_code}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <HStack>
                              <Icon as={FiUser} size="xs" color="gray.500" />
                              <Text fontSize="sm">{course.teacher_name}</Text>
                            </HStack>
                          </Table.Cell>
                          <Table.Cell>
                            <HStack>
                              <Icon as={FiClock} size="xs" color="gray.500" />
                              <Text fontSize="sm">{course.start_time} - {course.end_time}</Text>
                            </HStack>
                          </Table.Cell>
                          <Table.Cell>
                            <Badge colorPalette="blue" size="sm">{course.credits}</Badge>
                          </Table.Cell>
                          <Table.Cell>
                            <Badge 
                              colorPalette={course.is_mandatory ? 'red' : 'gray'}
                              size="sm"
                            >
                              {course.is_mandatory ? 'Obligatorio' : 'Electivo'}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell>
                            <Badge colorPalette="gray" size="sm">{course.cycle}</Badge>
                          </Table.Cell>
                          <Table.Cell>
                            <Text fontSize="sm" color={course.capacity > 20 ? "green.600" : "orange.600"}>
                              {course.capacity} estudiantes
                            </Text>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table.Root>
              )}
            </Card.Body>
          </Card.Root>

          {/* Resumen de inscripción */}
          <Card.Root position="sticky" top="4">
            <Card.Header>
              <HStack>
                <Icon as={FiShoppingCart} />
                <Heading size="md">Resumen de Inscripción</Heading>
              </HStack>
            </Card.Header>
            <Card.Body>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2}>Cursos seleccionados:</Text>
                  {selectedCourses.length === 0 ? (
                    <Text fontSize="sm" color="gray.400">No has seleccionado ningún curso</Text>
                  ) : (
                    <VStack gap={2} align="stretch">
                      {selectedCourses.map(courseId => {
                        const course = flatCourses.find(c => c.id === courseId);
                        if (!course) return null;
                        return (
                          <HStack key={courseId} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                            <VStack align="start" gap={1}>
                              <Text fontSize="sm" fontWeight="semibold">{course.course_name}</Text>
                              <Text fontSize="xs" color="gray.600">{course.course_group_code}</Text>
                            </VStack>
                            <Badge colorPalette="blue" size="sm">{course.credits} créd.</Badge>
                          </HStack>
                        );
                      })}
                    </VStack>
                  )}
                </Box>

                <Separator />

                <HStack justify="space-between">
                  <Text fontWeight="semibold">Total de créditos:</Text>
                  <Badge 
                    colorPalette={totalCredits > 22 ? "red" : totalCredits > 18 ? "orange" : "green"} 
                    size="lg"
                  >
                    {totalCredits}/22
                  </Badge>
                </HStack>

                {totalCredits > 22 && (
                  <Alert status="error" size="sm">
                    <Text fontSize="sm">
                      Has excedido el límite máximo de 22 créditos por semestre.
                    </Text>
                  </Alert>
                )}

                {totalCredits > 18 && totalCredits <= 22 && (
                  <Alert status="warning" size="sm">
                    <Text fontSize="sm">
                      Estás cerca del límite máximo de créditos (22).
                    </Text>
                  </Alert>
                )}

                <Button
                  colorPalette="blue"
                  size="lg"
                  onClick={handleConfirmEnrollment}
                  disabled={selectedCourses.length === 0 || isCreatingEnrollment || totalCredits > 22}
                  loading={isCreatingEnrollment}
                  w="full"
                >
                  {isCreatingEnrollment ? 'Procesando...' : 'Confirmar Inscripción'}
                </Button>

                {selectedCourses.length > 0 && (
                  <Alert status="info" size="sm">
                    <Text fontSize="sm">
                      Al confirmar, te inscribirás en {selectedCourses.length} curso(s) 
                      con un total de {totalCredits} créditos.
                    </Text>
                  </Alert>
                )}
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Vista previa del horario */}
          <SchedulePreview 
            courses={selectedCourses.map(id => flatCourses.find(c => c.id === id)).filter(Boolean)} 
          />
        </Grid>
      </VStack>
    </Box>
  );
};