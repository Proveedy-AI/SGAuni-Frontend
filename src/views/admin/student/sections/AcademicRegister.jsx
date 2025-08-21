import { useColorModeValue } from '@/components/ui';
import {
	useReadAcademicProgress,
	useReadAcademicTranscript,
	useReadCoursesByPeriod,
} from '@/hooks/students';
import {
	Badge,
	Box,
	Card,
	Flex,
	Heading,
	HStack,
	Icon,
	SimpleGrid,
	Stack,
	Table,
	Tabs,
	Text,
	VStack,
} from '@chakra-ui/react';
import { FiBookOpen, FiCalendar } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { ReactSelect } from '@/components';
import { GenerateAcademicTranscriptPdfModal } from '@/components/modals/mycourses';
import {
	AcademicProgressSection,
	GradesRecordSection,
} from '../../mycourses/sections';

export const AcademicRegister = ({ dataStudent }) => {
	const bgColor = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const [selectProgram, setSelectProgram] = useState(null);
	const headerBg = useColorModeValue('blue.50', 'blue.900');
	const periodHeaderBg = useColorModeValue('purple.100', 'purple.800');
	const hoverBg = useColorModeValue('gray.50', 'gray.700');
	const summaryBg = useColorModeValue('gray.50', 'gray.700');
	const [tab, setTab] = useState('courses');
	const { data: dataCoursesByPeriod } = useReadCoursesByPeriod(
		dataStudent?.uuid,
		selectProgram?.value
	);

	const {
		data: dataAcademicTranscript,
		isLoading: isLoadingAcademicTranscript,
	} = useReadAcademicTranscript(dataStudent?.uuid, selectProgram?.value);

	const { data: dataAcademicProgress, isLoading: isLoadingAcademicProgress } =
		useReadAcademicProgress(dataStudent?.uuid);

	const formatSchedule = (schedules) => {
		if (!schedules || schedules.length === 0) return 'Sin horario';

		return schedules
			.map(
				(schedule) =>
					`${schedule.day}: ${schedule.start_time} - ${schedule.end_time}`
			)
			.join(', ');
	};

	const ProgramsOptions = useMemo(
		() =>
			dataStudent?.admission_programs?.map((program) => ({
				label: program.program_name,
				value: program.program,
				academic_status: program.academic_status,
				academic_status_display: program.academic_status_display,
			})) || [],
		[dataStudent]
	);

	useEffect(() => {
		if (ProgramsOptions.length > 0 && !selectProgram) {
			setSelectProgram(ProgramsOptions[0]);
		}
	}, [ProgramsOptions, selectProgram]);
	const getGradeColor = (grade) => {
		if (grade >= 11) return 'blue';
		return 'red';
	};

	const isDownloadable =
		!isLoadingAcademicTranscript &&
		dataCoursesByPeriod?.total_periods?.length !== 0;

	const filteredAcademicProgressByProgram =
		dataAcademicProgress?.programs?.find(
			(data) => data?.program?.id === selectProgram?.value
		);

	return (
		<Stack gap={4}>
			<Stack bg='blue.100' p={4} borderRadius={6} overflow='hidden'>
				<Flex gap={4} direction={{ base: 'column', lg: 'row' }}>
					<Flex align='center' gap={3} flex={1}>
						<Text
							py={1}
							pr={2}
							color='blue.600'
							fontSize='md'
							fontWeight='bold'
						>
							Programa Académico:
						</Text>
						<Box
							bg='white'
							borderRadius={6}
							flex={1}
							maxW={{ base: 'full', lg: '320px' }}
							fontSize='sm'
						>
							<ReactSelect
								placeholder='Filtrar por programa...'
								value={selectProgram}
								onChange={(value) => setSelectProgram(value)}
								variant='flushed'
								size='xs'
								isSearchable
								isClearable
								options={ProgramsOptions}
							/>
						</Box>
					</Flex>
					<GenerateAcademicTranscriptPdfModal
						data={dataAcademicTranscript}
						isActive={isDownloadable}
					/>
				</Flex>
				<Flex
					justify='space-between'
					border='1px solid'
					borderColor='blue.400'
					borderRadius={8}
					direction={{ base: 'column', lg: 'row' }}
					fontSize={'sm'}
				>
					<SimpleGrid
						p={2}
						borderEndWidth={1}
						borderColor='blue.400'
						flex={1}
						columns={1}
					>
						<Text>
							<b>Programa:</b>{' '}
							{filteredAcademicProgressByProgram?.program?.name}
						</Text>
						<Text>
							<b>Año de admisión:</b>{' '}
							{filteredAcademicProgressByProgram?.admission_year}
						</Text>
					</SimpleGrid>
					<SimpleGrid p={2} flex={1} columns={1}>
						<Text color='gray.500'>
							<b>Inicio de programa:</b>{' '}
							{filteredAcademicProgressByProgram?.program_start_date}
						</Text>
						<Text color='gray.500'>
							<b>Estado:</b> {selectProgram?.academic_status_display}
						</Text>
					</SimpleGrid>
				</Flex>
			</Stack>
			<Tabs.Root
				value={tab}
				onValueChange={(e) => setTab(e.value)}
				variant='plain'
				my={3}
			>
				<Flex justify='space-between' align='center'>
					<Tabs.List bg='blue.100' rounded='l3' p='1'>
						<Tabs.Trigger color='blue.600' fontSize={'sm'} value='courses'>
							Cursos
						</Tabs.Trigger>
						<Tabs.Trigger
							color='blue.600'
							fontSize={'sm'}
							value='academic-summary'
						>
							Resumen Académico
						</Tabs.Trigger>
						<Tabs.Trigger
							color='blue.600'
							fontSize={'sm'}
							value='grades-record'
						>
							Record de notas
						</Tabs.Trigger>
						<Tabs.Indicator rounded='l2' />
					</Tabs.List>
				</Flex>
				<Tabs.Content value='courses'>
					<VStack gap={6} align='stretch'>
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
											Parece que aún no está inscrito en ningún curso.
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
												Una vez completada la matrícula, los cursos aparecerán
												aquí
											</Text>
										</HStack>
									</Box>
								</VStack>
							</Card.Root>
						) : (
							<>
								{dataCoursesByPeriod.data.map((periodData, periodIndex) => (
									<Box key={periodIndex} mb={3}>
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
													<strong>Total de Cursos:</strong>{' '}
													{periodData.total_courses}
												</Text>
												<Text fontSize='sm' color='gray.600'>
													<strong>Total Créditos:</strong>{' '}
													{periodData.courses.reduce(
														(sum, course) => sum + (course.credits || 0),
														0
													)}
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
																		<Text
																			fontSize='sm'
																			fontWeight='medium'
																			color='blue.600'
																		>
																			{course.course_code} -{' '}
																			{course.course_name}
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
																			colorPalette={getGradeColor(
																				course.final_grade
																			)}
																			variant='solid'
																			px={2}
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
								))}
							</>
						)}
					</VStack>
				</Tabs.Content>
				<Tabs.Content value='academic-summary'>
					<AcademicProgressSection
						academicProgress={filteredAcademicProgressByProgram}
						isLoading={isLoadingAcademicProgress}
					/>
				</Tabs.Content>
				<Tabs.Content value='grades-record'>
					<GradesRecordSection dataCoursesByPeriod={dataCoursesByPeriod} />
				</Tabs.Content>
			</Tabs.Root>
		</Stack>
	);
};

AcademicRegister.propTypes = {
	dataStudent: PropTypes.object.isRequired,
};
