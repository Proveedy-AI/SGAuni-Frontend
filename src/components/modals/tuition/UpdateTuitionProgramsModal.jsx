import { Field, Modal, toaster } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import {
	Box,
	Card,
	Flex,
	Heading,
	Icon,
	//Input,
	List,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import {
	useCreateEnrollmentsPrograms,
	useUpdateEnrollmentsPrograms,
} from '@/hooks/enrollments_programs';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import {
	FiBookOpen,
	FiCalendar,
	FiCheckCircle,
	FiClock,
	FiUsers,
} from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';
import { ReactSelect } from '@/components/select';
import { useReadPrograms } from '@/hooks';

export const UpdateTuitionProgramsModal = ({
	open,
	onClose,
	data,
	processData,
	fetchData,
	profileId,
	actionType,
	permissions,
}) => {
	const { mutate: createEnrollmentsPrograms, isPending: isCreating } =
		useCreateEnrollmentsPrograms();
	const { mutate: updateEnrollmentsPrograms, isPending: isUpdating } =
		useUpdateEnrollmentsPrograms();

	let queryParams = {};

	// Según permisos agregamos el filtro
	if (
		permissions &&
		!permissions.includes('enrollments.programsEnrollments.admin')
	) {
		queryParams.coordinator_id = profileId;
	}

	const { data: dataPrograms } = useReadPrograms(queryParams, {
		enabled: open,
	});

	const [formData, setFormData] = useState({
		program: '',
		startDate: '',
		endDate: '',
		evalStart: '',
		evalEnd: '',
		semester_start_date: '',
		//semesterCredits: '',
	});

	const ProgramsOptions = dataPrograms?.results?.map((department) => ({
		label: department.name,
		value: department.id,
	}));

	useEffect(() => {
		if (open && data) {
			setFormData({
				program: data.program || '',
				enrollment_period: data.enrollment_period || '',
				startDate: data.registration_start_date || '',
				endDate: data.registration_end_date || '',
				evalStart: data.examen_start_date || '',
				evalEnd: data.examen_end_date || '',
				semester_start_date: data.semester_start_date || '',
				//semesterCredits: data.credits || '',
			});
		} else {
			setFormData({
				program: '',
				startDate: '',
				endDate: '',
				evalStart: '',
				evalEnd: '',
				semester_start_date: '',
				//semesterCredits: '',
			});
		}
	}, [open, data]);

	const [errors, setErrors] = useState({});
	const validateFields = () => {
		const newErrors = {};

		if (!formData.program) {
			newErrors.program = 'El programa es requerido';
		}

		if (!formData.startDate) {
			newErrors.startDate = 'La fecha de inicio de inscripción es requerida';
		}

		if (!formData.endDate) {
			newErrors.endDate = 'La fecha de fin de inscripción es requerida';
		}

		if (
			formData.startDate &&
			formData.endDate &&
			new Date(formData.startDate) >= new Date(formData.endDate)
		) {
			newErrors.endDate =
				'La fecha de fin debe ser posterior a la fecha de inicio';
		}

		// Validar que el examen comience después del período de registro
		if (
			formData.endDate &&
			formData.evalStart &&
			new Date(formData.evalStart) <= new Date(formData.endDate)
		) {
			newErrors.evalStart =
				'El examen debe comenzar después del fin del período de Inscripciones';
		}

		if (!formData.evalStart) {
			newErrors.evalStart = 'La fecha de inicio de evaluación es requerida';
		}

		if (!formData.evalEnd) {
			newErrors.evalEnd = 'La fecha de fin de evaluación es requerida';
		}

		if (
			formData.evalStart &&
			formData.evalEnd &&
			new Date(formData.evalStart) >= new Date(formData.evalEnd)
		) {
			newErrors.evalEnd =
				'La fecha de fin de evaluación debe ser posterior a la fecha de inicio';
		}

		if (!formData.semester_start_date) {
			newErrors.semester_start_date =
				'La fecha de inicio del semestre es requerida';
		}

		// Validar que el semestre comience después del período de examen
		if (
			formData.evalEnd &&
			formData.semester_start_date &&
			new Date(formData.semester_start_date) <= new Date(formData.evalEnd)
		) {
			newErrors.semester_start_date =
				'El semestre debe comenzar después del fin del período de examen';
		}

		/*if (!formData.semesterCredits) {
			newErrors.semesterCredits = 'Los créditos del semestre son requeridos';
		}*/

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (key, value) => {
		const formatted =
			value instanceof Date ? format(value, 'yyyy-MM-dd') : value;

		setFormData((prev) => ({
			...prev,
			[key]: formatted,
		}));
	};

	const handleSave = () => {
		if (!validateFields()) return;

		if (actionType === 'create') {
			const payload = {
				program: formData.program,
				enrollment_period: processData.id,
				registration_start_date: formData.startDate,
				registration_end_date: formData.endDate,
				examen_start_date: formData.evalStart,
				examen_end_date: formData.evalEnd,
				semester_start_date: formData.semester_start_date,
				credits: formData.semesterCredits || 1,
			};

			createEnrollmentsPrograms(payload, {
				onSuccess: () => {
					toaster.create({
						title: 'Proceso registrado correctamente',
						type: 'success',
						onStatusChange({ status }) {
							if (status === 'unmounted');
						},
					});

					fetchData();
					onClose();
				},
				onError: (error) => {
					const backendErrors = error.response?.data;
					let errorMessage = 'Error al registrar el Proceso';

					if (backendErrors && typeof backendErrors === 'object') {
						errorMessage = Object.entries(backendErrors)
							// .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
							.map(
								([, value]) =>
									`${Array.isArray(value) ? value.join(', ') : value}`
							)
							.join(', ');
					}

					toaster.create({
						title: errorMessage,
						type: 'error',
						onStatusChange({ status }) {
							if (status === 'unmounted');
						},
					});
				},
			});
		} else if (actionType === 'edit') {
			const payload = {
				program: formData.program,
				enrollment_period: processData.id,
				registration_start_date: formData.startDate,
				registration_end_date: formData.endDate,
				examen_start_date: formData.evalStart,
				examen_end_date: formData.evalEnd,
				semester_start_date: formData.semester_start_date,
				credits: formData.semesterCredits || 1,
			};

			updateEnrollmentsPrograms(
				{ id: data.id, payload },
				{
					onSuccess: () => {
						toaster.create({
							title: 'Programa actualizado correctamente',
							type: 'success',
							onStatusChange({ status }) {
								if (status === 'unmounted');
							},
						});

						fetchData();
						onClose();
					},
					onError: (error) => {
						toaster.create({
							title: error.message || 'Error al actualizar el Programa',
							type: 'error',
							onStatusChange({ status }) {
								if (status === 'unmounted');
							},
						});
					},
				}
			);
		}
	};

	return (
		<Modal
			title={
				actionType === 'edit'
					? 'Editar Programa de Matrícula'
					: 'Crear Programa de Matrícula'
			}
			placement='center'
			size='5xl'
			open={open}
			onOpenChange={(e) => {
				if (!e.open) onClose();
			}}
			onSave={handleSave}
			loading={isCreating || isUpdating}
		>
			<Stack
				gap={2}
				pb={6}
				maxH={{ base: 'full', md: '65vh' }}
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': { width: '6px' },
					'&::-webkit-scrollbar-thumb': {
						background: 'gray.300',
						borderRadius: 'full',
					},
				}}
			>
				<Card.Root>
					<Card.Header>
						<Card.Title
							display='flex'
							alignItems='center'
							gap={2}
							fontSize='lg'
						>
							<Icon as={FiBookOpen} boxSize={5} color='blue.600' />
							Información Básica del Programa
						</Card.Title>
					</Card.Header>

					<Card.Body>
						<SimpleGrid gap={6}>
							<Field
								label='Programa Académico:'
								invalid={!!errors.program}
								errorText={errors.program}
								required
							>
								<ReactSelect
									value={ProgramsOptions?.find(
										(opt) => opt.value === formData.program
									)}
									onChange={(option) =>
										handleChange('program', option?.value || '')
									}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={ProgramsOptions}
								/>
							</Field>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title
							display='flex'
							alignItems='center'
							gap={2}
							fontSize='lg'
						>
							<Icon as={FiCalendar} boxSize={5} color='blue.600' />
							Fechas del Proceso de Matrícula
						</Card.Title>
					</Card.Header>

					<Card.Body gap={6}>
						{/* Periodo de Inscripciones */}
						<Box>
							<Flex align='center' gap={2} mb={4}>
								<Icon as={FiUsers} boxSize={4} color='orange.600' />
								<Text fontWeight='semibold' color='gray.900'>
									Periodo de Inscripciones
								</Text>
							</Flex>
							<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
								<Field
									label='Fecha de inicio'
									invalid={!!errors.startDate}
									errorText={errors.startDate}
									required
								>
									<CustomDatePicker
										selectedDate={formData.startDate}
										onDateChange={(date) => handleChange('startDate', date)}
										buttonSize='md'
										size='100%'
										minDate={new Date()}
									/>
								</Field>
								<Field
									label='Fecha de fin'
									invalid={!!errors.endDate}
									errorText={errors.endDate}
									required
								>
									<CustomDatePicker
										selectedDate={formData.endDate}
										onDateChange={(date) => handleChange('endDate', date)}
										buttonSize='md'
										size='150px'
										minDate={new Date()}
									/>
								</Field>
							</SimpleGrid>
						</Box>

						{/* Periodo de Exámenes */}
						<Box>
							<Flex align='center' gap={2} mb={4}>
								<Icon as={FiClock} boxSize={4} color='red.600' />
								<Text fontWeight='semibold' color='gray.900'>
									Periodo de Evaluaciones
								</Text>
							</Flex>
							<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
								<Field
									label='Evaluación inicial'
									invalid={!!errors.evalStart}
									errorText={errors.evalStart}
									required
								>
									<CustomDatePicker
										selectedDate={formData.evalStart}
										onDateChange={(date) => handleChange('evalStart', date)}
										buttonSize='md'
										size='150px'
										minDate={new Date()}
									/>
								</Field>
								<Field
									label='Evaluación final'
									invalid={!!errors.evalEnd}
									errorText={errors.evalEnd}
									required
								>
									<CustomDatePicker
										selectedDate={formData.evalEnd}
										onDateChange={(date) => handleChange('evalEnd', date)}
										buttonSize='md'
										size='150px'
										minDate={new Date()}
									/>
								</Field>
							</SimpleGrid>
						</Box>
					</Card.Body>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title
							display='flex'
							alignItems='center'
							gap={2}
							fontSize='lg'
						>
							<Icon as={LuGraduationCap} boxSize={5} color='blue.600' />
							Fechas Académicas
						</Card.Title>
					</Card.Header>

					<Card.Body gap={6}>
						<Box>
							<Field
								label='Inicio de semestre:'
								invalid={!!errors.semester_start_date}
								errorText={errors.semester_start_date}
								required
							>
								<CustomDatePicker
									selectedDate={formData.semester_start_date}
									onDateChange={(date) =>
										handleChange('semester_start_date', date)
									}
									buttonSize='md'
									size='150px'
									minDate={new Date()}
								/>
							</Field>
						</Box>
						{/*<Box>
							<Field
								label='Creditos del semestre:'
								invalid={!!errors.semesterCredits}
								errorText={errors.semesterCredits}
								required
							>
								<Input
									value={formData.semesterCredits}
									onChange={(e) =>
										handleChange('semesterCredits', e.target.value)
									}
								/>
							</Field>
						</Box>*/}
					</Card.Body>
				</Card.Root>

				<Box
					bg='blue.50'
					p={4}
					borderRadius='lg'
					border='1px solid'
					borderColor='blue.200'
				>
					<Flex align='flex-start' gap={3}>
						<Box bg='blue.100' mb={4} borderRadius='full'>
							<Icon as={FiCheckCircle} boxSize={4} color='blue.600' />
						</Box>
						<Box>
							<Heading
								as='h4'
								size='sm'
								fontWeight='semibold'
								color='blue.900'
								mb={2}
							>
								Pasos a seguir despues de la creación:
							</Heading>
							<List.Root
								spacing={1}
								color='blue.800'
								fontSize='sm'
								styleType='none'
							>
								<List.Item>
									Envía el programa al director académico para que pueda ser
									evaluado y aprobado. Este paso es obligatorio para continuar
									con el proceso de matrícula.
								</List.Item>

								<List.Item>
									El Director académico revisará el cronograma, las modalidades
									asignadas y la consistencia general del programa.
								</List.Item>

								<List.Item>
									El cronograma será evaluado y aprobado o rechazado
								</List.Item>
							</List.Root>
							<Text fontSize='sm' color='blue.800' mt={2}>
								Importante: No se podrá activar el proceso de matrícula si el
								programa no ha sido enviado y aprobado por el director
								académico.
							</Text>
						</Box>
					</Flex>
				</Box>
			</Stack>
		</Modal>
	);
};

UpdateTuitionProgramsModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	data: PropTypes.object,
	processData: PropTypes.object,
	fetchData: PropTypes.func,
	profileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	actionType: PropTypes.oneOf(['create', 'edit']),
	existingNames: PropTypes.arrayOf(PropTypes.string),
	permissions: PropTypes.array,
};
