import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import {
	Button,
	Stack,
	Text,
	Box,
	Badge,
	Card,
	SimpleGrid,
	HStack,
	Flex,
	VStack,
	Heading,
	Input,
} from '@chakra-ui/react';
import { Modal } from '@/components/ui';
import {
	FiAlertTriangle,
	FiCheckCircle,
	FiCreditCard,
	FiPlus,
	FiX,
} from 'react-icons/fi';
import { useReadCoursesByPeriod } from '@/hooks/students';

export const ConvalidacionForm = ({ convalidationsData, dataStudent }) => {
	const [open, setOpen] = useState(false);
	const [selectedOldCourses, setSelectedOldCourses] = useState([]);
	const [selectedNewCourse, setSelectedNewCourse] = useState(null);
	const [convalidations, setConvalidations] = useState([]);
	const [isPending, setIsPending] = useState(false);
	const [searchTermOld, setSearchTermOld] = useState('');
	const [searchTermNew, setSearchTermNew] = useState('');
	const contentRef = useRef();

	const { data: dataCoursesByPeriod } = useReadCoursesByPeriod(
		dataStudent?.uuid,
		convalidationsData?.from_program
	);

	// Mock data - replace with actual data from your API
	const oldCoursesOptions = (dataCoursesByPeriod?.data || []).flatMap(
		(periodData) =>
			periodData.courses.map((course) => ({
				id: course.id_course_selection,
				course_name: course.course_name,
				course_code: course.course_code,
				credits_course: course.credits,
				final_grade: course.final_grade,
				cycle: course.cycle,
				group_section: course.group_section,
				teacher: course.teacher,
				is_repeated: course.is_repeated,
				academic_period: periodData.academic_period, // <-- agregamos periodo
				schedules: course.schedules,
			}))
	);

	const newCoursesOptions = [
		{
			id: '1',
			e_periods_programs_id: 'epp_001',
			course_id: 'c_001',
			is_mandatory: true,
			cycle: 1,
			credits: 4,
			course_name: 'Cálculo Diferencial',
			course_code: 'CAL101',
		},
		{
			id: '2',
			e_periods_programs_id: 'epp_001',
			course_id: 'c_002',
			is_mandatory: false,
			cycle: 2,
			credits: 3,
			course_name: 'Programación Básica',
			course_code: 'PRG101',
		},
	];

	const totalOldCredits = selectedOldCourses.reduce(
		(sum, course) => sum + course.credits_course,
		0
	);
	const newCredits = selectedNewCourse?.credits || 0;
	const creditDifference = newCredits - totalOldCredits;
	const needsPayment = creditDifference > 0;

	const handleAddConvalidation = () => {
		if (selectedOldCourses.length === 0 || !selectedNewCourse) return;

		const newConvalidation = {
			course_selection_ids: selectedOldCourses.map((c) => c.id),
			course_period_program_id: selectedNewCourse.id,
			oldCredits: totalOldCredits,
			newCredits: newCredits,
			oldCourses: selectedOldCourses,
			newCourse: selectedNewCourse,
		};

		setConvalidations([...convalidations, newConvalidation]);
		setSelectedOldCourses([]);
		setSelectedNewCourse(null);
	};

	const removeConvalidation = (index) => {
		setConvalidations(convalidations.filter((_, i) => i !== index));
	};

	const handleSubmitData = async () => {
		setIsPending(true);

		const payload = {
			convalidations: convalidations.map((convalidation) => ({
				course_selection_ids: convalidation.course_selection_ids.map((id) =>
					Number.parseInt(id)
				),
				course_period_program_id: Number.parseInt(
					convalidation.course_period_program_id
				),
			})),
		};

		console.log('[v0] Payload to send:', JSON.stringify(payload, null, 2));

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsPending(false);
		setOpen(false);
		setConvalidations([]);
	};

	const totalConvalidationCredits = convalidations.reduce(
		(sum, c) => sum + c.newCredits,
		0
	);
	const totalPaymentRequired = convalidations.reduce((sum, c) => {
		const diff = c.newCredits - c.oldCredits;
		return sum + (diff > 0 ? diff : 0);
	}, 0);

	const normalizeString = (str) =>
		str
			.normalize('NFD') // descompone acentos
			.replace(/[\u0300-\u036f]/g, '') // elimina marcas de acento
			.toLowerCase();

	return (
		<Modal
			title='Agregar convalidación'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar convalidación
				</Button>
			}
			onSave={handleSubmitData}
			loading={isPending}
			size={'7xl'}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack gap={4} ref={contentRef}>
				<Box p={6} maxH='calc(90vh - 140px)' overflowY='auto'>
					<Stack gap={6}>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
							{/* Cursos Anteriores */}
							<Stack gap={3}>
								<Text fontSize='md' fontWeight='bold' color='blue.700'>
									{convalidationsData?.from_program_name}
								</Text>
								<Text fontSize='sm' fontWeight='medium' color='gray.700'>
									Cursos Anteriores (Selecciona uno o más)
								</Text>

								<Input
									placeholder='Buscar curso...'
									size='sm'
									value={searchTermOld}
									onChange={(e) => setSearchTermOld(e.target.value)}
								/>

								<Box maxH='250px' overflowY='auto'>
									<Stack gap={2}>
										{oldCoursesOptions
											.filter(
												(course) =>
													!convalidations.some((c) =>
														c.course_selection_ids.includes(course.id)
													) && // excluir cursos ya agregados
													(normalizeString(course.course_name).includes(
														normalizeString(searchTermOld)
													) ||
														normalizeString(course.course_code).includes(
															normalizeString(searchTermOld)
														)) // filtrar por búsqueda
											)
											.map((course) => {
												const isSelected = selectedOldCourses.find(
													(c) => c.id === course.id
												);
												return (
													<Card.Root
														key={course.id}
														variant='outline'
														borderWidth='1px'
														cursor='pointer'
														_hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
														onClick={() => {
															if (isSelected) {
																setSelectedOldCourses(
																	selectedOldCourses.filter(
																		(c) => c.id !== course.id
																	)
																);
															} else {
																setSelectedOldCourses([
																	...selectedOldCourses,
																	course,
																]);
															}
														}}
														borderColor={isSelected ? 'blue.500' : 'gray.200'}
														bg={isSelected ? 'blue.50' : 'white'}
													>
														<Card.Body>
															<Stack
																direction='row'
																justify='space-between'
																align='flex-start'
															>
																<Box>
																	<Text fontWeight='medium' color='gray.900'>
																		{course.course_code}
																	</Text>
																	<Text fontSize='sm' color='gray.600'>
																		{course.course_name}
																	</Text>
																	<Text fontSize='sm' color='gray.500'>
																		Nota: {course.final_grade} - Periodo:{' '}
																		{course.academic_period}
																	</Text>
																</Box>
																<Badge
																	colorPalette='green'
																	px={2}
																	py={1}
																	rounded='full'
																	fontSize='xs'
																>
																	{course.credits_course} créditos
																</Badge>
															</Stack>
														</Card.Body>
													</Card.Root>
												);
											})}
									</Stack>
								</Box>
							</Stack>

							{/* Curso Nuevo */}
							<Stack gap={3}>
								<Text fontSize='md' fontWeight='bold' color='blue.700'>
									{convalidationsData?.to_program_name}
								</Text>
								<Text fontSize='sm' fontWeight='medium' color='gray.700'>
									Curso del Programa Actual (Selecciona uno)
								</Text>

								<Input
									placeholder='Buscar curso...'
									size='sm'
									value={searchTermNew}
									onChange={(e) => setSearchTermNew(e.target.value)}
								/>

								<Box maxH='250px' overflowY='auto'>
									<Stack gap={2}>
										{newCoursesOptions
											.filter((course) => {
												const term = normalizeString(searchTermNew);
												return (
													normalizeString(course.course_name).includes(term) ||
													normalizeString(course.course_code).includes(term)
												);
											})
											.map((course) => {
												const isSelected = selectedNewCourse?.id === course.id;
												return (
													<Card.Root
														key={course.id}
														variant='outline'
														borderWidth='1px'
														cursor='pointer'
														onClick={() =>
															setSelectedNewCourse(isSelected ? null : course)
														}
														_hover={{ borderColor: 'blue.200', bg: 'blue.50' }}
														borderColor={isSelected ? 'blue.300' : 'gray.200'}
														bg={isSelected ? 'blue.50' : 'white'}
													>
														<Card.Body>
															<Stack
																direction='row'
																justify='space-between'
																align='flex-start'
															>
																<Box>
																	<Stack
																		direction='row'
																		align='center'
																		spacing={2}
																	>
																		<Text fontWeight='medium' color='gray.900'>
																			{course.course_code}
																		</Text>
																		{course.is_mandatory && (
																			<Badge
																				colorScheme='red'
																				fontSize='xs'
																				px={1.5}
																			>
																				Obligatorio
																			</Badge>
																		)}
																	</Stack>
																	<Text fontSize='sm' color='gray.600'>
																		{course.course_name}
																	</Text>
																	<Text fontSize='xs' color='gray.500'>
																		Ciclo {course.cycle}
																	</Text>
																</Box>
																<Badge
																	colorPalette='blue'
																	px={2}
																	py={1}
																	rounded='full'
																	fontSize='xs'
																>
																	{course.credits} créditos
																</Badge>
															</Stack>
														</Card.Body>
													</Card.Root>
												);
											})}
									</Stack>
								</Box>
							</Stack>
						</SimpleGrid>
						{selectedOldCourses.length > 0 && selectedNewCourse && (
							<Card.Root bg='gray.50' rounded='lg' p={3}>
								<Card.Header pb={2}>
									<Flex align='center' justify='space-between'>
										<Card.Title
											fontSize='lg'
											fontWeight='medium'
											color='gray.900'
										>
											Validación de Créditos
										</Card.Title>
										<HStack gap={4} fontSize='sm' color='gray.700'>
											<Text>
												Antiguos: <Text as='strong'>{totalOldCredits}</Text>
											</Text>
											<Text>→</Text>
											<Text>
												Nuevo: <Text as='strong'>{newCredits}</Text>
											</Text>
										</HStack>
									</Flex>
								</Card.Header>

								<Card.Body>
									{needsPayment ? (
										<Flex
											align='center'
											gap={2}
											p={3}
											bg='amber.50'
											border='1px'
											borderColor='amber.200'
											rounded='lg'
										>
											<FiCreditCard className='w-5 h-5 text-amber-600' />
											<Box>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='amber.800'
												>
													Se generará orden de pago
												</Text>
												<Text fontSize='xs' color='amber.700'>
													Diferencia: {creditDifference} créditos adicionales
												</Text>
											</Box>
										</Flex>
									) : (
										<Flex
											align='center'
											gap={2}
											p={3}
											bg='green.50'
											border='1px'
											borderColor='green.200'
											rounded='lg'
										>
											<FiCheckCircle className='w-5 h-5 text-green-600' />
											<Text fontSize='sm' fontWeight='medium' color='green.800'>
												Convalidación posible sin costo adicional
											</Text>
										</Flex>
									)}

									<Button
										onClick={handleAddConvalidation}
										mt={3}
										w='full'
										colorPalette='blue'
										rounded='lg'
										fontWeight='medium'
									>
										Agregar a la lista
									</Button>
								</Card.Body>
							</Card.Root>
						)}

						{convalidations.length > 0 && (
							<VStack gap={4} align='stretch'>
								<Flex justify='space-between' align='center'>
									<Heading fontSize='md' fontWeight='medium' color='gray.900'>
										Convalidaciones Armadas
									</Heading>
									<Text fontSize='sm' color='gray.600'>
										Total: {totalConvalidationCredits} créditos
										{totalPaymentRequired > 0 && (
											<Text as='span' ml={2} color='amber.600'>
												(+{totalPaymentRequired} créditos a pagar)
											</Text>
										)}
									</Text>
								</Flex>

								<VStack gap={3} align='stretch'>
									{convalidations.map((convalidation, index) => (
										<Card.Root
											key={index}
											border='1px solid'
											borderColor='gray.200'
											rounded='lg'
											p={2}
										>
											<Card.Header>
												<Flex justify='space-between' align='center' w='full'>
													<Card.Title>Convalidación #{index + 1}</Card.Title>
													<Button
														onClick={() => removeConvalidation(index)}
														size='sm'
														variant='ghost'
														rounded='full'
													>
														<FiX size={16} color='gray' />
													</Button>
												</Flex>
											</Card.Header>
											<Card.Body>
												<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
													<Box>
														<Text
															fontSize='sm'
															fontWeight='medium'
															color='gray.700'
															mb={2}
														>
															Cursos Anteriores:
														</Text>
														<VStack align='start' gap={1}>
															{convalidation.oldCourses.map((course) => (
																<Text
																	key={course.id}
																	fontSize='sm'
																	color='gray.600'
																>
																	{course.course_code} - {course.course_name} (
																	{course.credits_course} créditos)
																</Text>
															))}
														</VStack>
													</Box>

													<Box>
														<Text
															fontSize='sm'
															fontWeight='medium'
															color='gray.700'
															mb={2}
														>
															Curso Nuevo:
														</Text>
														<Text fontSize='sm' color='gray.600'>
															{convalidation.newCourse.course_code} -{' '}
															{convalidation.newCourse.course_name} (
															{convalidation.newCourse.credits} créditos)
														</Text>
													</Box>
												</SimpleGrid>

												<Box
													mt={3}
													pt={3}
													borderTop='1px'
													borderColor='gray.100'
												>
													<Flex
														justify='space-between'
														align='center'
														fontSize='sm'
													>
														<Text>
															Créditos: {convalidation.oldCredits} →{' '}
															{convalidation.newCredits}
														</Text>
														{convalidation.newCredits >
															convalidation.oldCredits && (
															<HStack
																gap={1}
																px={2}
																py={1}
																bg='amber.100'
																color='amber.800'
																rounded='full'
																fontSize='xs'
																fontWeight='medium'
															>
																<FiAlertTriangle className='w-3 h-3' />
																<Text>Requiere pago</Text>
															</HStack>
														)}
													</Flex>
												</Box>
											</Card.Body>
										</Card.Root>
									))}
								</VStack>
							</VStack>
						)}
					</Stack>
				</Box>
			</Stack>
		</Modal>
	);
};

ConvalidacionForm.propTypes = {
	convalidationsData: PropTypes.array,
	dataStudent: PropTypes.object,
};
