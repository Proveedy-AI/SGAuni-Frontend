import PropTypes from 'prop-types';
import { Modal, useColorModeValue, ConfirmModal, Alert, Checkbox, toaster } from '@/components/ui';
import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Group,
	Heading,
	HStack,
	Icon,
	IconButton,
	Spinner,
	Table,
	Text,
	VStack,
} from '@chakra-ui/react';
import { FiArrowRight, FiBookOpen, FiCalendar } from 'react-icons/fi';
import { useRef, useState } from 'react';
import { FaUserTimes } from 'react-icons/fa';
import { useRemoveStudentToCourse } from '@/hooks/students';

export const RemoveStudentCourseModal = ({ item, fetchData = () => {} }) => {
  const [open, setOpen] = useState(false);
  const [confirmRead, setConfirmRead] = useState(false);
  const contentRef = useRef();

  const [error, setError] = useState(null);

  const { mutate: removeStudentToCourse, isPending } = useRemoveStudentToCourse();

  const handleRemove = () => {
    if (!confirmRead) {
      setError('Debes confirmar que has leído las consecuencias.');
      return;
    }

    removeStudentToCourse(item?.id_course_selection, {
      onSuccess: () => {
        toaster.create({
          title: 'Estudiante retirado del curso',
          description: `El estudiante ha sido retirado del curso ${item.course_name} exitosamente.`,
          type: 'success',
        })
        setOpen(false);
        setConfirmRead(false);
        setError(null);
        fetchData();
      },
      onError: (err) => {
        setError(err?.response?.data?.error || 'Error al retirar al estudiante del curso.');
        toaster.create({
          title: 'Error',
          description: err?.response?.data?.error || 'Error al retirar al estudiante del curso.',
          type: 'error',
        })
      },
    });
  }
  return (
    <ConfirmModal
      placement='center'
      trigger={
        <IconButton
          variant='outline'
          size='sm'
          bg='red.500'
          _hover={{ bg: 'red.600' }}
          css={{
            _icon: {
              width: '5',
              height: '5',
            },
          }}
          disabled={item.group_section === "N/A" || item?.course_status_id !== 2}
        >
          <FaUserTimes />
        </IconButton>
      }
      size='md'
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
      disabled={!confirmRead}
      onConfirm={handleRemove}
      loading={isPending}
    >
      <Box>
        <Text>
          ¿Estás seguro de que deseas retirar al estudiante del curso <b>{item?.course_name}</b> (Sección: <b>{item?.group_section}</b>)?
        </Text>
        <Alert status='warning' mt={4}>
          <Text fontSize='sm'>
            El estudiante ya no estará inscrito en este curso.<br />
            <b>Esta acción es irreversible.</b>
          </Text>
        </Alert>
        <Checkbox
          isChecked={confirmRead}
          onChange={(e) => setConfirmRead(e.target.checked)}
          mt={4} 
        >
          <Text fontSize='sm'>
            He leído y entiendo las consecuencias de retirar al estudiante.
          </Text>
        </Checkbox>
        {error && (
            <Text fontSize='xs' color='red.500' mt={1}>
              {error}
            </Text>
          )}
      </Box>
    </ConfirmModal>
  );
}

RemoveStudentCourseModal.propTypes = {
  item: PropTypes.object,
  fetchData: PropTypes.func,
}

export const ViewCourseGroupSchedulesModal = ({ item, courseGroups }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef();

  // Filtrar todos los grupos con el mismo group_code
  const sameGroupCode = Array.isArray(courseGroups)
    ? courseGroups.filter((g) => g.group_section === item.group_section)
    : [item];

  // Unir todos los horarios de los grupos con el mismo group_code
  const allSchedules = sameGroupCode.flatMap((g) => {
    // Si schedule_info es un array, mapear cada uno, si no, devolver array vacío
    if (Array.isArray(g.schedules)) {
      return g.schedules.map((s) => ({
        day: s.day,
        duration: s.start_time && s.end_time ? `${s.start_time} - ${s.end_time}` : '-',
        type_schedule: g.type_schedule || s.type_schedule || '-',
        teacher_name: g.teacher || s.teacher || '-',
      }));
    }
    return [];
  });

  return (
    <Modal
      trigger={
        <IconButton
          variant='outline'
          aria-label='Ver horarios del grupo'
          size='sm'
          bg='yellow.300'
          _hover={{ bg: 'yellow.400' }}
          css={{
            _icon: {
              width: '5',
              height: '5',
            },
          }}
          disabled={item.group_section === "N/A"}
        >
          <FiCalendar />
        </IconButton>
      }
      size='3xl'
      open={open}
      hiddenFooter={true}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Box>
        <Heading mb={4} gap={2}>
          <Text fontWeight='semibold' fontSize='lg'>
            Curso: <strong>{item.course_name}</strong>
          </Text>
          <Text fontWeight='semibold' fontSize='lg'>
            Sección:{' '}
            <Badge colorPalette='blue' variant='subtle' fontSize='md'>
              {item.group_section}
            </Badge>
          </Text>
        </Heading>
        <Table.Root variant='simple' size='sm' w='100%'>
          <Table.Header bg='gray.50'>
            <Table.Row>
              <Table.Cell w='20%'>Día</Table.Cell>
              <Table.Cell w='30%'>Horas de clase</Table.Cell>
              <Table.Cell w='20%'>Tipo</Table.Cell>
              <Table.Cell w='30%'>Docente</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {allSchedules.length > 0 ? (
              allSchedules.map((s, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell>{s.day}</Table.Cell>
                  <Table.Cell>{s.duration}</Table.Cell>
                  <Table.Cell>{s.type_schedule || '-'}</Table.Cell>
                  <Table.Cell>{s.teacher_name || '-'}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Text color='gray.400' textAlign='center'>
                    Sin horarios registrados
                  </Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Modal>
  );
};

ViewCourseGroupSchedulesModal.propTypes = {
  item: PropTypes.object,
  courseGroups: PropTypes.array,
};

export const CoursesListByPeriodCard = ({ data, handleRowClick, permissions = [], fetchData = () => {} }) => {
	const bgColor = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const headerBg = useColorModeValue('blue.50', 'blue.900');
	const periodHeaderBg = useColorModeValue('purple.100', 'purple.800');
	const hoverBg = useColorModeValue('gray.50', 'gray.700');
	const summaryBg = useColorModeValue('gray.50', 'gray.700');

	const getGradeColor = (grade) => {
		if (grade >= 11) return 'blue';
		return 'red';
	};

  // Filtrar cursos para mostrar solo los que tengan diferente group_section
  const uniqueCourses = data.courses.filter(
    (course, index, self) =>
      index === self.findIndex(c => c.group_section === course.group_section && c.group_section !== "N/A")
  );

  const ConvalidateCourses = data.courses.filter(
    (course) => course.group_section === "N/A"
  );

	return (
		<Box mb={3}>
			<Box
				bg={periodHeaderBg}
				py={2}
				textAlign='center'
				borderRadius='md'
				border='1px solid'
				borderColor={borderColor}
			>
				<Text fontSize={14} fontWeight='bold' color='purple.700'>
					PERIODO ACADÉMICO {data.academic_period}
				</Text>
			</Box>

			<Box my={2} px={6} py={3} bg={summaryBg} borderRadius='md'>
				<HStack justify='space-between'>
					<Text fontSize='sm' color='gray.600'>
						<strong>Total de Cursos:</strong> {data.total_courses}
					</Text>
					<Text fontSize='sm' color='gray.600'>
						<strong>Total Créditos:</strong>{' '}
						{data.courses
              .filter(
                (course, index, self) =>
                  index === self.findIndex(c => c.course_code === course.course_code)
              )
              .reduce((sum, course) => {
							// Obtener créditos del primer schedule si existe
							return sum + (course?.credits || 0);
						}, 0)}
					</Text>
				</HStack>
			</Box>

			<Box
				bg={bgColor}
				borderRadius='lg'
				overflow='hidden'
				border='1px solid'
				borderColor={borderColor}
			>
				<Table.ScrollArea>
					<Table.Root variant='simple' size='sm'>
						<Table.Header bg={headerBg}>
							<Table.Row>
								<Table.Cell
									borderRight={'1px solid'}
									borderColor={borderColor}
									fontWeight='bold'
									color='blue.700'
									textAlign='center'
									minWidth='20px'
								>
									Ciclo
								</Table.Cell>
								<Table.Cell
									borderRight={'1px solid'}
									borderColor={borderColor}
									fontWeight='bold'
									color='blue.700'
									textAlign='center'
									minWidth='360px'
								>
									Asignatura
								</Table.Cell>
                <Table.Cell
									borderRight={'1px solid'}
									borderColor={borderColor}
									fontWeight='bold'
									color='blue.700'
									textAlign='center'
									minWidth='80px'
								>
									Repetido
								</Table.Cell>
								<Table.Cell
									borderRight={'1px solid'}
									borderColor={borderColor}
									fontWeight='bold'
									color='blue.700'
									textAlign='center'
									minWidth='80px'
								>
									Calificación
								</Table.Cell>
								<Table.Cell
									borderRight={'1px solid'}
									borderColor={borderColor}
									fontWeight='bold'
									color='blue.700'
									textAlign='center'
									minWidth='80px'
								>
									Créditos
								</Table.Cell>
								<Table.Cell
									borderRight={'1px solid'}
									borderColor={borderColor}
									fontWeight='bold'
									color='blue.700'
									textAlign='center'
									minWidth='100px'
								>
									Sección
								</Table.Cell>
                <Table.Cell
									borderRight={'1px solid'}
									borderColor={borderColor}
									fontWeight='bold'
									color='blue.700'
									textAlign='center'
									minWidth='100px'
								>
									Horario(s)
								</Table.Cell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{[...ConvalidateCourses, ...uniqueCourses]?.map((course, index) => (
								<Table.Row
									key={index}
									_hover={{ bg: hoverBg }}
									borderColor={borderColor}
									onClick={(e) => {
										if (e.target.closest('button') || e.target.closest('a'))
											return;
                    if (course.group_section === "N/A") return;
                    if (course.course_status_id === 3) return;
                    handleRowClick(course);
                    }}
                    cursor='pointer'
                  >
                    <Table.Cell
                      borderRight={'1px solid'}
                      borderColor={borderColor}
                    >
                      <Text
                        fontSize='sm'
                        color='blue.600'
                        fontWeight='medium'
                        textAlign='center'
                      >
                        {course.cycle || '-'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell
                      borderRight={'1px solid'}
                      borderColor={borderColor}
                    >
                      <VStack align='start' spacing={1}>
                        <Flex align='center' gap={2}>
                          <Text fontSize='sm' fontWeight='medium' color='blue.600'>
                            {course.course_code} - {course.course_name}
                          </Text>
                          {course?.course_status !== "" &&
                            <Badge>
                              {course.course_status}
                            </Badge>
                          }
                        </Flex>
                      </VStack>
                    </Table.Cell>
                    <Table.Cell
                      borderRight={'1px solid'}
                      borderColor={borderColor}
                      textAlign="center"
                      fontWeight="semibold"
                    >
                      {course.is_repeated ? 'SI' : 'NO'}
                    </Table.Cell>
                    <Table.Cell
                      textAlign='center'
                      borderRight={'1px solid'}
                      borderColor={borderColor}
                    >
                      {course?.course_status_id !== 3 ? course.final_grade && (
                        <Badge
                          colorPalette={getGradeColor(course.final_grade)}
                          variant='solid'
                          px={2}
                          borderRadius='md'
                        >
                          {course.final_grade}
                        </Badge>
                      ) : (
                        <Badge colorPalette='gray' variant='solid' px={2} borderRadius='md'>
                          R
                        </Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell
                      textAlign='center'
                      borderRight={'1px solid'}
                      borderColor={borderColor}
                    >
                      <Text fontSize='sm' fontWeight='medium'>
                        {course.credits}
                      </Text>
                    </Table.Cell>
                    <Table.Cell
                      textAlign='center'
                      borderRight={'1px solid'}
                      borderColor={borderColor}
                    >
                      <Text fontSize='sm' fontWeight='medium'>
                        {course.group_section}
                      </Text>
                    </Table.Cell>
                    <Table.Cell
                      textAlign='center'
                      borderRight={'1px solid'}
                      borderColor={borderColor}
                    >
                      <Group>
                        <ViewCourseGroupSchedulesModal item={course} courseGroups={data?.courses} />
                        {permissions?.includes("students.students.removecourse") && (
                          <RemoveStudentCourseModal item={course} fetchData={fetchData} />
                        )}
                      </Group>
                    </Table.Cell>
                    {/* <Table.Cell
                      borderRight={'1px solid'}
                      borderColor={borderColor}
                    >
                      <Text fontSize='sm'>{course.teacher}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontSize='sm' color='gray.600'>
                        {formatSchedule(course.schedules)}
                      </Text>
                    </Table.Cell> */}
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</Table.ScrollArea>
			</Box>
		</Box>
	);
};

CoursesListByPeriodCard.propTypes = {
	data: PropTypes.object,
	handleRowClick: PropTypes.func,
  permissions: PropTypes.array,
  fetchData: PropTypes.func,
};

export const CoursesByPeriodSection = ({
	isLoadingCoursesByPeriod,
	dataCoursesByPeriod,
	handleRowClick = () => {},
	handleClickToProcessEnrollment = () => {},
  permissions = [],
  fetchData = () => {},
}) => {
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	return (
		<Box>
			{isLoadingCoursesByPeriod ? (
				<Box p={6} maxW='full' mx='auto' textAlign='center'>
					<Spinner size='lg' />
					<Text mt={4}>Cargando cursos...</Text>
				</Box>
			) : (
				<VStack spacing={6} align='stretch'>
					{!dataCoursesByPeriod?.data ||
					dataCoursesByPeriod.data.length === 0 ? (
						<Card.Root p={8} maxW='full' mx='auto' textAlign='center'>
							<VStack spacing={6}>
								<Box
									p={4}
									borderRadius='full'
									bg={{ base: 'blue.50', _dark: 'blue.900' }}
									border='2px solid'
									borderColor={{ base: 'blue.100', _dark: 'blue.700' }}
								>
									<Icon
										as={FiBookOpen}
										boxSize={12}
										color={{ base: 'blue.500', _dark: 'blue.300' }}
									/>
								</Box>

								<VStack spacing={3}>
									<Heading
										size='lg'
										color={{ base: 'gray.700', _dark: 'gray.200' }}
									>
										No tienes cursos registrados
									</Heading>
									<Text
										fontSize='md'
										textAlign={'justify'}
										color='gray.500'
										maxW='md'
										mx='auto'
									>
										Parece que aún no estás inscrito en ningún curso. Puedes
										comenzar el proceso de matrícula para inscribirte en tus
										cursos.
									</Text>
								</VStack>

								<Box
									p={4}
									bg={{ base: 'gray.50', _dark: 'gray.700' }}
									borderRadius='md'
									border='1px solid'
									borderColor={borderColor}
									maxW='md'
								>
									<HStack spacing={3} justify='center'>
										<Icon as={FiCalendar} color='blue.500' />
										<Text fontSize='sm' color='gray.600'>
											Una vez completada la matrícula, tus cursos aparecerán
											aquí
										</Text>
									</HStack>
								</Box>

								<Button
									size='lg'
									bg='blue.500'
									onClick={() => handleClickToProcessEnrollment}
									_hover={{
										bg: 'blue.600',
									}}
								>
									<FiArrowRight /> Ir al Proceso de Matrícula
								</Button>

								<Text fontSize='xs' color='gray.400' mt={2}>
									¿Necesitas ayuda? Contacta con la oficina de registros
									académicos
								</Text>
							</VStack>
						</Card.Root>
					) : (
						dataCoursesByPeriod.data.map((periodData, periodIndex) => (
							<CoursesListByPeriodCard
								key={periodIndex}
								data={periodData}
								handleRowClick={handleRowClick}
                permissions={permissions}
                fetchData={fetchData}
							/>
						))
					)}
				</VStack>
			)}
		</Box>
	);
};

CoursesByPeriodSection.propTypes = {
	isLoadingCoursesByPeriod: PropTypes.bool,
	dataCoursesByPeriod: PropTypes.object,
	handleRowClick: PropTypes.func,
	handleClickToProcessEnrollment: PropTypes.func,
  permissions: PropTypes.array,
  fetchData: PropTypes.func,
};
