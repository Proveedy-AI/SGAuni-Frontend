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
} from '@chakra-ui/react';
import { Modal } from '@/components/ui';
import {
	FiAlertTriangle,
	FiCheckCircle,
	FiCreditCard,
	FiPlus,
	FiX,
} from 'react-icons/fi';

export const ConvalidacionForm = () => {
	const [open, setOpen] = useState(false);
	const [selectedOldCourses, setSelectedOldCourses] = useState([]);
	const [selectedNewCourse, setSelectedNewCourse] = useState(null);
	const [convalidations, setConvalidations] = useState([]);
	const [isPending, setIsPending] = useState(false);
	const contentRef = useRef();

	// Mock data - replace with actual data from your API
	const oldCoursesOptions = [
		{
			id: '1',
			enrollment_id: 'enr_001',
			course_group_id: 'cg_001',
			credits_course: 3,
			selected_at: '2023-01-15',
			status: 'completed',
			final_grade: 85,
			status_enrollment: 'active',
			course_name: 'Matemáticas I',
			course_code: 'MAT101',
		},
		{
			id: '2',
			enrollment_id: 'enr_001',
			course_group_id: 'cg_002',
			credits_course: 4,
			selected_at: '2023-01-15',
			status: 'completed',
			final_grade: 90,
			status_enrollment: 'active',
			course_name: 'Física General',
			course_code: 'FIS101',
		},
	];

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
		{
			id: '3',
			e_periods_programs_id: 'epp_001',
			course_id: 'c_002',
			is_mandatory: false,
			cycle: 2,
			credits: 3,
			course_name: 'Programación Básica',
			course_code: 'PRG101',
		},
		{
			id: '4',
			e_periods_programs_id: 'epp_001',
			course_id: 'c_002',
			is_mandatory: false,
			cycle: 2,
			credits: 3,
			course_name: 'Programación Básica',
			course_code: 'PRG101',
		},
		{
			id: '5',
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
								<Text fontSize='sm' fontWeight='medium' color='gray.700'>
									Cursos Anteriores (Selecciona uno o más)
								</Text>

								<Box maxH='300px' overflowY='auto'>
									<Stack gap={2}>
										{oldCoursesOptions
											.filter(
												(course) =>
													!convalidations.some((c) =>
														c.course_selection_ids.includes(course.id)
													) // excluir cursos ya agregados
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
																	<Text fontSize='xs' color='gray.500'>
																		Nota: {course.final_grade}
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
								<Text fontSize='sm' fontWeight='medium' color='gray.700'>
									Curso del Programa Actual (Selecciona uno)
								</Text>

								<Box maxH='250px' overflowY='auto'>
									<Stack gap={2}>
										{newCoursesOptions.map((course) => {
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
	fetchData: PropTypes.func,
	oldCoursesOptions: PropTypes.array.isRequired,
	newCoursesOptions: PropTypes.array.isRequired,
};
