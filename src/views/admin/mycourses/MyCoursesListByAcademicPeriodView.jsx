import PropTypes from 'prop-types';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { GenerateAcademicTranscriptPdfModal } from '@/components/modals/mycourses';
import { Button, useColorModeValue } from '@/components/ui';
import {
	useReadAcademicTranscript,
	useReadCoursesByPeriod,
} from '@/hooks/students';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Box,
	Heading,
	Table,
	Text,
	Badge,
	VStack,
	HStack,
	Spinner,
	Icon,
	Card,
	Stack,
	Flex,
} from '@chakra-ui/react';
import { FiArrowRight, FiBookOpen, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import { useReadMyPrograms } from '@/hooks/person/useReadMyPrograms';
import { useState, useEffect } from 'react';
import { ReactSelect } from '@/components';

export const AcademicSummaryCard = () => {
	return (
		<Card.Root mx='auto' bg='white' borderRadius='lg'>
			<Card.Header
				py={4}
				bg='blue.50'
				borderBottom='1px solid'
				borderColor='blue.200'
			>
				<Flex align='center' gapX={3}>
					<Icon as={FiBookOpen} boxSize={5} />
					<Text fontSize='lg' fontWeight='bold' color='blue.700'>
						Resumen Académico
					</Text>
				</Flex>
			</Card.Header>

			<Card.Body p={6}>
				<Flex gap={8}>
					<VStack flex={1} spacing={6} align='stretch' maxW='30%'>
						<VStack spacing={3} align='stretch'>
							<HStack justify='space-between' align='center'>
								<Text fontSize='md' fontWeight='semibold' color='blue.600'>
									Creditaje Aprobado
								</Text>
								<Badge bg='teal' variant='solid' fontSize='md' px={3} py={1}>
									205
								</Badge>
							</HStack>
						</VStack>

						<VStack spacing={2} align='stretch' mt={4} pl={4}>
							<HStack justify='space-between'>
								<Text fontSize='sm' color='blue.500'>
									- Obligatorios
								</Text>
								<Badge colorScheme='teal' variant='outline' size='sm'>
									201
								</Badge>
							</HStack>
							<HStack justify='space-between'>
								<Text fontSize='sm' color='blue.500'>
									- De Especialidad
								</Text>
								<Badge colorScheme='teal' variant='outline' size='sm'>
									0
								</Badge>
							</HStack>
							<HStack justify='space-between'>
								<Text fontSize='sm' color='blue.500'>
									- Electivos Generales
								</Text>
								<Badge colorScheme='teal' variant='outline' size='sm'>
									4
								</Badge>
							</HStack>
							<HStack justify='space-between'>
								<Text fontSize='sm' color='blue.500'>
									- Electivos de Especialidad
								</Text>
								<Badge colorScheme='teal' variant='outline' size='sm'>
									0
								</Badge>
							</HStack>
							<HStack justify='space-between'>
								<Text fontSize='sm' color='blue.500'>
									- Optativos
								</Text>
								<Badge colorScheme='teal' variant='outline' size='sm'>
									0
								</Badge>
							</HStack>
							<HStack justify='space-between'>
								<Text fontSize='sm' color='blue.500'>
									- Alternativos
								</Text>
								<Badge colorScheme='teal' variant='outline' size='sm'>
									0
								</Badge>
							</HStack>
							<HStack justify='space-between'>
								<Text fontSize='sm' color='blue.500'>
									- De Otra Especialidad
								</Text>
								<Badge colorScheme='teal' variant='outline' size='sm'>
									0
								</Badge>
							</HStack>
							<HStack justify='space-between'>
								<Text fontSize='sm' color='blue.500'>
									- Más de una vez
								</Text>
								<Badge colorScheme='teal' variant='outline' size='sm'>
									0
								</Badge>
							</HStack>
							<HStack justify='space-between'>
								<Text fontSize='sm' color='blue.500'>
									- Otros
								</Text>
								<Badge colorScheme='teal' variant='outline' size='sm'>
									0
								</Badge>
							</HStack>
						</VStack>

						<HStack justify='space-between' align='center'>
							<Text fontSize='md' fontWeight='semibold' color='orange.600'>
								Creditaje Faltante
							</Text>
							<Badge bg='orange' variant='solid' fontSize='md' px={3} py={1}>
								8
							</Badge>
						</HStack>

						<HStack
							borderTop='1px solid'
							borderColor='gray.200'
							pt={5}
							justify='space-between'
							align='center'
						>
							<Text fontSize='lg' fontWeight='bold' color='green.600'>
								Promedio Ponderado
							</Text>
							<Badge bg='green' variant='solid' fontSize='lg' px={4} py={2}>
								14.815
							</Badge>
						</HStack>
					</VStack>
					<VStack spacing={3} align='stretch' maxW='full'>
						<Text fontSize='sm' fontWeight='semibold' color='gray.700'>
							Hitos Académicos Alcanzados:
						</Text>

						<VStack spacing={2} align='stretch'>
							{/* Diplomado Achievement */}
							<HStack
								spacing={3}
								p={3}
								bg='green.50'
								borderRadius='md'
								border='1px solid'
								borderColor='green.200'
							>
								<Box w={3} h={3} bg='green.500' borderRadius='full' />
								<Text fontSize='sm' fontWeight='medium' color='green.700'>
									✓ Diplomado (24 créditos completados)
								</Text>
							</HStack>

							{/* Egresado Achievement */}
							<HStack
								spacing={3}
								p={3}
								bg='blue.50'
								borderRadius='md'
								border='1px solid'
								borderColor='blue.200'
							>
								<Box w={3} h={3} bg='blue.500' borderRadius='full' />
								<Text fontSize='sm' fontWeight='medium' color='blue.700'>
									✓ Egresado (48 créditos y promedio ≥14)
								</Text>
							</HStack>

							{/* Pending Achievement Example */}
							<HStack
								spacing={3}
								p={3}
								bg='gray.100'
								borderRadius='md'
								border='1px solid'
								borderColor='gray.300'
							>
								<Box w={3} h={3} bg='gray.400' borderRadius='full' />
								<Text fontSize='sm' fontWeight='medium' color='gray.600'>
									Pendiente: Titulación (completar todos los créditos)
								</Text>
							</HStack>
						</VStack>
					</VStack>
				</Flex>
			</Card.Body>

			<Card.Footer></Card.Footer>
		</Card.Root>
	);
};

export const CoursesListByPeriodCard = ({ periodData, handleRowClick }) => {
	const bgColor = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const headerBg = useColorModeValue('blue.50', 'blue.900');
	const periodHeaderBg = useColorModeValue('purple.100', 'purple.800');
	const hoverBg = useColorModeValue('gray.50', 'gray.700');
	const summaryBg = useColorModeValue('gray.50', 'gray.700');

	const getGradeColor = (grade) => {
		if (grade >= 11) return 'blue.400';
		return 'red.400';
	};

	const formatSchedule = (schedules) => {
		if (!schedules || schedules.length === 0) return 'Sin horario';

		return schedules
			.map(
				(schedule) =>
					`${schedule.day}: ${schedule.start_time} - ${schedule.end_time}`
			)
			.join(', ');
	};

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
					PERIODO ACADÉMICO {periodData.academic_period}
				</Text>
			</Box>

			<Box my={2} px={6} py={3} bg={summaryBg} borderRadius='md'>
				<HStack justify='space-between'>
					<Text fontSize='sm' color='gray.600'>
						<strong>Total de Cursos:</strong> {periodData.total_courses}
					</Text>
					<Text fontSize='sm' color='gray.600'>
						<strong>Total Créditos:</strong>{' '}
						{periodData.courses.reduce((sum, course) => {
							// Obtener créditos del primer schedule si existe
							return sum + (course.schedules?.[0]?.credits || 0);
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
									minWidth='100px'
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
									minWidth='100px'
								>
									Calificación
								</Table.Cell>
								<Table.Cell
									borderRight={'1px solid'}
									borderColor={borderColor}
									fontWeight='bold'
									color='blue.700'
									textAlign='center'
									minWidth='100px'
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
									minWidth='320px'
								>
									Docente
								</Table.Cell>
								<Table.Cell
									fontWeight='bold'
									color='blue.700'
									textAlign='center'
									width='320px'
								>
									Horario
								</Table.Cell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{periodData.courses.map((course, index) => (
								<Table.Row
									key={index}
									_hover={{ bg: hoverBg }}
									borderColor={borderColor}
									onClick={(e) => {
										if (e.target.closest('button') || e.target.closest('a'))
											return;
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
											{course.cycle || 'N/A'}
										</Text>
									</Table.Cell>
									<Table.Cell
										borderRight={'1px solid'}
										borderColor={borderColor}
									>
										<VStack align='start' spacing={1}>
											<Text fontSize='sm' fontWeight='medium' color='blue.600'>
												{course.course_code} - {course.course_name}
											</Text>
											{course.is_repeated && (
												<Badge colorScheme='orange' size='sm'>
													Repetido
												</Badge>
											)}
										</VStack>
									</Table.Cell>
									<Table.Cell
										textAlign='center'
										borderRight={'1px solid'}
										borderColor={borderColor}
									>
										{course.final_grade && (
											<Badge
												bg={getGradeColor(course.final_grade)}
												variant='solid'
												p={1}
												boxSize={6}
												textAlign={'center'}
												justifyContent='center'
												color='white'
												borderRadius='md'
											>
												{course.final_grade}
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
										borderRight={'1px solid'}
										borderColor={borderColor}
									>
										<Text fontSize='sm'>{course.teacher}</Text>
									</Table.Cell>
									<Table.Cell>
										<Text fontSize='sm' color='gray.600'>
											{formatSchedule(course.schedules)}
										</Text>
									</Table.Cell>
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
	periodData: PropTypes.object,
	handleRowClick: PropTypes.func,
};

export const MyCoursesListByAcademicPeriodView = () => {
	const { data: dataUser, isLoading } = useReadUserLogged();
	const studentUUID = dataUser?.student?.uuid;

	const { data: dataMyPrograms, isLoading: isLoadingMyPrograms } =
		useReadMyPrograms();

	const MyProgramsOptions = dataMyPrograms?.map((program) => ({
		value: program?.enrollments[0]?.id,
		label: program.program_name,
	}));

	const borderColor = useColorModeValue('gray.200', 'gray.600');

	const currentEnrollment = EncryptedStorage.load('selectedEnrollmentProccess');

	const [programEnrolled, setProgramEnrolled] = useState(null);

	// Efecto para establecer el valor por defecto cuando los datos estén disponibles
	useEffect(() => {
		if (MyProgramsOptions && currentEnrollment && !programEnrolled) {
			const defaultProgram = MyProgramsOptions.find(
				(program) => program.value === currentEnrollment?.id
			);
			if (defaultProgram) {
				setProgramEnrolled(defaultProgram);
			} else if (MyProgramsOptions.length > 0) {
				// Si no encuentra el currentEnrollment, toma el primer programa disponible
				setProgramEnrolled(MyProgramsOptions[0]);
			}
		}
	}, [MyProgramsOptions, currentEnrollment, programEnrolled]);

	const {
		data: dataAcademicTranscript,
		isLoading: isLoadingAcademicTranscript,
	} = useReadAcademicTranscript(studentUUID, programEnrolled?.value);

	const {
		data: dataCoursesByPeriod,
		isLoading: isLoadingCoursesByPeriod,
		error: errorCoursesByPeriod,
	} = useReadCoursesByPeriod();

	const isDownloadable =
		!isLoadingAcademicTranscript &&
		!isLoading &&
		dataCoursesByPeriod?.total_periods?.length !== 0;

	const navigate = useNavigate();

	const handleRowClick = (course) => {
		const encrypted = Encryptor.encrypt(course.id_course_selection);
		const encoded = encodeURIComponent(encrypted);
		navigate(`/mycourses/${encoded}`);
	};

	// Error state
	if (errorCoursesByPeriod) {
		return (
			<Box p={6} maxW='full' mx='auto'>
				<Box
					p={4}
					bg='red.50'
					borderRadius='md'
					border='1px solid'
					borderColor='red.200'
				>
					<Text color='red.600' fontWeight='medium'>
						Error al cargar los cursos:{' '}
						{errorCoursesByPeriod.message || 'Error desconocido'}
					</Text>
				</Box>
			</Box>
		);
	}

	return (
		<Box p={6} maxW='full' mx='auto'>
      <Box>
        <Heading my={3}>
          <Stack
            justify={'space-between'}
            align='center'
            direction={{ base: 'column', md: 'row' }}
          >
            <Text fontWeight='bold' color='blue.700'>
              Historial académico
            </Text>
            <ReactSelect
              isLoading={isLoadingMyPrograms}
              options={MyProgramsOptions}
              value={programEnrolled}
              onChange={setProgramEnrolled}
            />
          </Stack>
        </Heading>
      </Box>
			<AcademicSummaryCard />
      <Box>
        <Heading my={3}>
				<Stack
					justify={'space-between'}
					align='center'
					direction={{ base: 'column', md: 'row' }}
				>
					<Text fontWeight='bold' color='blue.700'>
						Mis Cursos
					</Text>
					<GenerateAcademicTranscriptPdfModal
						data={dataAcademicTranscript}
						isActive={isDownloadable}
					/>
				</Stack>
			</Heading>

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
                    onClick={() => navigate('/myprocedures/enrollment-process')}
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
                  periodData={periodData}
                  handleRowClick={handleRowClick}
                />
              ))
            )}
          </VStack>
        )}
      </Box>
		</Box>
	);
};
