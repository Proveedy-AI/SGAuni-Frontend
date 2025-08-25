import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
	Text,
	Box,
	Card,
	VStack,
	HStack,
	SimpleGrid,
	Flex,
	Button,
	Badge,
	Collapsible,
	Icon,
	Input,
	Spinner,
} from '@chakra-ui/react';
import { ReactSelect } from '@/components';
import { FiChevronDown, FiChevronUp, FiUser, FiClock } from 'react-icons/fi';
import { useReadCourseGradesByCourseId } from '@/hooks/students';

export const ExpandableCourseCard = ({ course, gradesCache, setGradesCache }) => {
	const [open, setOpen] = useState(false);
	const [gradeFormula, setGradeFormula] = useState('Cargando...');

  const shouldFetch = !!course.id_course_selection && open && !gradesCache[course.id_course_selection];

	const { data: dataCourseGrades, isLoading: isLoadingCourseGrades } =
		useReadCourseGradesByCourseId(
			course.id_course_selection,
			{},
			{ enabled: shouldFetch }
		);

  useEffect(() => {
      if (dataCourseGrades && !gradesCache[course.id_course_selection]) {
          setGradesCache((prev) => ({
              ...prev,
              [course.id_course_selection]: dataCourseGrades,
          }));
      }
  }, [dataCourseGrades, course.id_course_selection, gradesCache, setGradesCache]);

	useEffect(() => {
		const gradesData = gradesCache[course.id_course_selection] || dataCourseGrades;
		if (gradesData) {
      const hasConfiguredWithWeight = gradesData?.data?.evaluations?.some(
        (evaluation) => evaluation.weight_percentage !== null
      );

			const formulaParts = gradesData?.data?.evaluations.map(
				(evaluation, index) => {
					return `
            ${index !== 0 ? '+' : ''}
            ${hasConfiguredWithWeight ? `${evaluation.weight_percentage}%` : ''}
            ${hasConfiguredWithWeight ? `(${evaluation.evaluation_name})` : evaluation.evaluation_name}
          `;
				}
			);
      const formulaString = `
        ${formulaParts.join(' ')}${hasConfiguredWithWeight ? '' : `/ ${gradesData?.data?.evaluations.length}`}
      `
			setGradeFormula(formulaString || 'No está definido');
		}
	}, [gradesCache, course.id_course_selection, dataCourseGrades]);

	const getGradeStatus = (grade) => {
		return grade >= 10.5 ? 'Aprobado' : 'Desaprobado';
	};

	const getGradeColor = (grade) => {
		return grade >= 10.5 ? 'green' : 'red';
	};

	return (
		<Box>
			<Card.Root variant='outline'>
				<Card.Body>
					<Flex justify='space-between' align='center'>
						<HStack spacing={4} flex={1}>
							<Box>
								<Text fontSize='md' fontWeight='semibold'>
									{course.course_name}
								</Text>
							</Box>

							<Badge colorPalette={getGradeColor(course.final_grade)} size='sm'>
								{getGradeStatus(course.final_grade)}
							</Badge>

							<Text fontSize='sm' color='gray.600'>
								Promedio: {course.final_grade}
							</Text>
						</HStack>

						<Collapsible.Root>
							<Collapsible.Trigger asChild>
								<Button
									boxSize={8}
									bg='white'
									color='blue.500'
									onClick={() => setOpen(!open)}
								>
									{open ? <FiChevronUp /> : <FiChevronDown />}
								</Button>
							</Collapsible.Trigger>
						</Collapsible.Root>
					</Flex>

					{/* Detalles expandidos del curso */}
					<Collapsible.Root open={open}>
						<Collapsible.Content>
							<Box mt={4} pt={4} borderTop='1px' borderColor='gray.200'>
								{/* Información del curso */}
								<SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={4}>
									<HStack>
										<Icon as={FiUser} color='blue.500' />
										<Box>
											<Text fontSize='xs' color='gray.500'>
												Docente:
											</Text>
											<Text fontSize='sm' fontWeight='medium'>
												{course.teacher}
											</Text>
										</Box>
									</HStack>

									<HStack>
										<Icon as={FiClock} color='blue.500' />
										<Box>
											<Text fontSize='xs' color='gray.500'>
												Horario:
											</Text>
											{course.schedules.map((schedule, index) => (
												<Text key={index} fontSize='sm' fontWeight='medium'>
													{schedule.day} {schedule.start_time} -{' '}
													{schedule.end_time}
												</Text>
											))}
										</Box>
									</HStack>
								</SimpleGrid>

								{/* Información adicional */}
								<SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={4}>
									<Box textAlign={{ base: 'left', md: 'center' }}>
										<Text fontSize='sm' fontWeight='bold'>
											{course.is_repeated_course ? 'Sí' : 'No'}
										</Text>
										<Text fontSize='xs' color='gray.500'>
											Repetido
										</Text>
									</Box>

									<Box textAlign={{ base: 'left', md: 'center' }}>
										<Text fontSize='sm' fontWeight='bold'>
											{course.credits}
										</Text>
										<Text fontSize='xs' color='gray.500'>
											Créditos
										</Text>
									</Box>

									<Box textAlign={{ base: 'left', md: 'center' }}>
										<Text fontSize='sm' fontWeight='bold'>
											{course.course_code}
										</Text>
										<Text fontSize='xs' color='gray.500'>
											Código
										</Text>
									</Box>

									<Box textAlign={{ base: 'left', md: 'center' }}>
										<Text fontSize='sm' fontWeight='bold'>
											{course.group_section}
										</Text>
										<Text fontSize='xs' color='gray.500'>
											Sección
										</Text>
									</Box>
								</SimpleGrid>

								{/* Evaluaciones */}
								<Box>
									<Text fontSize='md' fontWeight='bold' mb={3}>
										Evaluaciones
									</Text>

									<VStack my={2} align='stretch'>
										{/* Simulando evaluaciones basadas en la nota final */}
										{isLoadingCourseGrades ? (
											<Spinner size='sm' color='blue.500' />
										) : dataCourseGrades?.data?.evaluations.length > 0 ? (
											dataCourseGrades.data.evaluations.map(
												(evaluation, index) => (
													<Flex
														key={index}
														justify='space-between'
														align='center'
														p={2}
														bg='gray.50'
														borderRadius='md'
													>
														<Text fontSize='sm'>
															{evaluation.evaluation_name}
														</Text>
														<Text fontSize='sm' fontWeight='bold'>
															{evaluation.grade_obtained}
														</Text>
													</Flex>
												)
											)
										) : (
											<Flex
												justify='space-between'
												align='center'
												p={2}
												bg='gray.50'
												borderRadius='md'
											>
												<Text fontSize='sm'>Sin evaluaciones</Text>
											</Flex>
										)}
									</VStack>

									{/* Fórmula de calificación */}
									<Box my={2} bg='green.50' p={3} borderRadius='md'>
										<Text
											fontSize='sm'
											fontWeight='bold'
											color='green.700'
											mb={1}
										>
											Fórmula de calificación:
										</Text>
										<Text fontSize='sm' color='green.600'>
											{gradeFormula}
										</Text>
									</Box>

									{/* Promedio final */}
									<Flex
										justify='space-between'
										align='center'
										p={3}
										bg='blue.50'
										borderRadius='md'
									>
										<Text fontSize='md' fontWeight='bold' color='blue.700'>
											Promedio:
										</Text>
										<Badge
											colorPalette={getGradeColor(course.final_grade)}
											size='lg'
										>
											{course.final_grade} |{' '}
											{getGradeStatus(course.final_grade)}
										</Badge>
									</Flex>
								</Box>
							</Box>
						</Collapsible.Content>
					</Collapsible.Root>
				</Card.Body>
			</Card.Root>
		</Box>
	);
};

ExpandableCourseCard.propTypes = {
	course: PropTypes.object,
  gradesCache: PropTypes.object,
  setGradesCache: PropTypes.func,
};

export const GradesRecordSection = ({ dataCoursesByPeriod }) => {
	const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [gradesCache, setGradesCache] = useState({});

	// Crear opciones para el select de períodos
	const periodOptions =
		dataCoursesByPeriod?.data?.map((period) => ({
			value: period.academic_period,
			label: period.academic_period,
		})) || [];

	// Obtener datos del período seleccionado
	const selectedPeriodData = dataCoursesByPeriod?.data?.find(
		(period) => period.academic_period === selectedPeriod?.value
	);

	// Calcular estadísticas del período
	const getStatistics = () => {
		if (!selectedPeriodData)
			return { totalCourses: 0, credits: 0, average: 0, passed: 0 };

		const courses = selectedPeriodData.courses;
		const totalCourses = courses.length;
		const totalCredits = courses.reduce(
			(sum, course) => sum + course.credits,
			0
		);
		const passed = courses.filter(
			(course) => course.final_grade >= 10.5
		).length;
		const average =
			courses.reduce((sum, course) => sum + course.final_grade, 0) /
			totalCourses;

		return {
			totalCourses,
			credits: totalCredits,
			average: average.toFixed(1),
			passed,
		};
	};

	const statistics = getStatistics();

	return (
		<VStack spacing={6} align='stretch'>
			<Box>
				<Flex align='center' gap={3} flex={1}>
					<Text py={1} pr={2} color='blue.600' fontSize='md' fontWeight='bold'>
						Seleccionar Período:
					</Text>
					<Box
						bg='white'
						borderRadius={6}
						flex={1}
						maxW={{ base: 'full', lg: '320px' }}
						fontSize='sm'
						overflow='hidden'
					>
						<ReactSelect
							value={selectedPeriod}
							onChange={setSelectedPeriod}
							options={periodOptions}
							placeholder='Seleccione un período'
							variant='flushed'
							size='xs'
							isSearchable
							isClearable
						/>
					</Box>
				</Flex>
			</Box>

			{selectedPeriodData && (
				<>
					{/* Resumen General del Período */}
					<Card.Root>
						<Card.Header>
							<Text fontSize='lg' fontWeight='bold'>
								Resumen General del Período
							</Text>
						</Card.Header>
						<Card.Body
							borderWidth={1}
							borderColor='gray.200'
							m={6}
							overflow='hidden'
						>
							<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
								<Flex
									direction={{ base: 'column', md: 'row' }}
									justify='space-between'
									alignItems={{ base: 'flex-start', md: 'center' }}
									gapX={4}
									gapY={2}
								>
									<Text fontSize='sm' fontWeight='semibold'>
										Cantidad de cursos matriculados:
									</Text>
									<Input
										readOnly
										value={String(statistics.totalCourses).padStart(2, '0')}
										textAlign='center'
										bg='blue.200'
										color='blue.600'
										h='fit'
										py={1}
										fontSize='lg'
										fontWeight='bold'
										maxW='120px'
									/>
								</Flex>
								<Flex
									direction={{ base: 'column', md: 'row' }}
									justify='space-between'
									alignItems={{ base: 'flex-start', md: 'center' }}
									gapX={4}
									gapY={2}
								>
									<Text fontSize='sm' fontWeight='semibold'>
										Promedio ponderado:
									</Text>
									<Input
										readOnly
										value={statistics.average}
										textAlign='center'
										bg='blue.200'
										color='blue.600'
										h='fit'
										py={1}
										fontSize='lg'
										fontWeight='bold'
										maxW='120px'
									/>
								</Flex>
							</SimpleGrid>
						</Card.Body>
					</Card.Root>

					{/* Lista de Cursos */}
					<Card.Root>
						<Card.Header>
							<Text fontSize='lg' fontWeight='bold' color='blue.600'>
								Lista de Cursos
							</Text>
						</Card.Header>
						<Card.Body>
							<VStack spacing={3} align='stretch' overflow='hidden'>
								{selectedPeriodData.courses.map((course) => (
									<ExpandableCourseCard
										key={course.id_course_selection}
										course={course}
										gradesCache={gradesCache}
										setGradesCache={setGradesCache}
									/>
								))}
							</VStack>
						</Card.Body>
					</Card.Root>
				</>
			)}

			{!selectedPeriod && (
				<Card.Root>
					<Card.Body>
						<Text textAlign='center' color='gray.500'>
							Seleccione un período académico para ver el record de notas
						</Text>
					</Card.Body>
				</Card.Root>
			)}
		</VStack>
	);
};

GradesRecordSection.propTypes = {
	dataCoursesByPeriod: PropTypes.object,
};
