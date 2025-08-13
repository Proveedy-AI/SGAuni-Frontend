import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Modal, Tooltip, useColorModeValue } from '@/components/ui';
import {
	Badge,
	Box,
	Card,
	Heading,
	HStack,
	Icon,
	IconButton,
	Spinner,
	Stack,
	Table,
	Text,
	VStack,
} from '@chakra-ui/react';

import { HiBookOpen } from 'react-icons/hi2';
import { FiBookOpen, FiCalendar } from 'react-icons/fi';

export const CoursesSelections = () => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const bgColor = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const headerBg = useColorModeValue('blue.50', 'blue.900');
	const periodHeaderBg = useColorModeValue('purple.100', 'purple.800');
	const hoverBg = useColorModeValue('gray.50', 'gray.700');
	const summaryBg = useColorModeValue('gray.50', 'gray.700');

	const mockRegistroAcademico = {
		data: [
			{
				academic_period: '2025-1',
				courses: [
					{
						course_code: 'CS101',
						course_name: 'Introducción a la Programación',
						credits: 4,
						cycle: 1,
						final_grade: 7.5,
						group_section: 'A1',
						id_course_selection: 14,
						is_repeated: false,
						schedules: [
							{
								day: 'Lunes',
								start_time: '08:00',
								end_time: '12:00',
							},
						],
						teacher: 'Armando Diaz',
					},
				],
				total_courses: 1,
			},
		],
		total_periods: 1,
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

	const getGradeColor = (grade) => {
		if (grade >= 11) return 'blue.400';
		return 'red.400';
	};

	return (
		<Modal
			title='Registro Académico'
			placement='center'
			size='8xl'
			trigger={
				<Box>
					<Tooltip
						content='Registro Académico'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton colorPalette='cyan' size='xs'>
							<HiBookOpen />
						</IconButton>
					</Tooltip>
				</Box>
			}
			onSave={''}
			loading={''}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
			hiddenFooter={true}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				{!mockRegistroAcademico ? (
					<Box p={6} maxW='full' mx='auto' textAlign='center'>
						<Spinner size='lg' />
						<Text mt={4}>Cargando cursos...</Text>
					</Box>
				) : (
					<VStack spacing={6} align='stretch'>
						{!mockRegistroAcademico?.data ||
						mockRegistroAcademico.data.length === 0 ? (
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
							mockRegistroAcademico.data.map((periodData, periodIndex) => (
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
							))
						)}
					</VStack>
				)}
			</Stack>
		</Modal>
	);
};

CoursesSelections.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
};

/*
const itemsFunctions = [
  {
    value: 'general_dashboard',
    title: 'Panel (general)',
    icon: <HiShieldCheck />,
  },
  {
    value: 'advisor_dashboard',
    title: 'Panel (asesor)',
    icon: <HiShieldCheck />,
  },
  {
    value: 'dispatcher_dashboard',
    title: 'Panel (asignador)',
    icon: <HiShieldCheck />,
  },
  { value: 'marketing', title: 'Marketing', icon: <HiShieldCheck /> },
  { value: 'ventas', title: 'Ventas', icon: <HiShieldCheck /> },
  { value: 'productos', title: 'Productos', icon: <HiShieldCheck /> },
  { value: 'calendar', title: 'Calendario', icon: <HiShieldCheck /> },
  { value: 'reports', title: 'Reportes', icon: <HiShieldCheck /> },
  { value: 'users', title: 'Usuarios', icon: <HiShieldCheck /> },
  { value: 'inbox', title: 'Bandeja de entrada', icon: <HiShieldCheck /> },
  { value: 'integrations', title: 'Integraciones', icon: <HiShieldCheck /> },
  { value: 'settings', title: 'Configuración', icon: <HiShieldCheck /> },
];
*/
