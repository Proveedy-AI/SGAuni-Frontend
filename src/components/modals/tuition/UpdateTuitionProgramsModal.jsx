import { Field, Modal, toaster } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import {
	Box,
	Card,
	FieldErrorText,
	Flex,
	Heading,
	Icon,
	Input,
	List,
	SimpleGrid,
	Spinner,
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
import { FiBookOpen, FiCalendar, FiCheckCircle, FiClock, FiUsers } from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';

export const UpdateTuitionProgramsModal = ({
	open,
	onClose,
	data,
	processData,
	fetchData,
	actionType,
	existingNames = [],
}) => {
	const { mutate: createEnrollmentsPrograms, isPending: isCreating } =
		useCreateEnrollmentsPrograms();
	const { mutate: updateEnrollmentsPrograms, isPending: isUpdating } =
		useUpdateEnrollmentsPrograms();

	const [toasterShown, setToasterShown] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		startDate: '',
		endDate: '',
		evalStart: '',
		evalEnd: '',
		semester_start_date: '',
	});

	const isValid = Object.values(formData).every((val) =>
		typeof val === 'string'
			? val.trim() !== ''
			: val !== null && val !== undefined
	);

	useEffect(() => {
		if (open && data) {
			setFormData({
				name: data.name || data.academic_period_name || '',
				startDate: data.examen_start_date || '',
				endDate: data.examen_end_date || '',
				evalStart: data.registration_start_date || '',
				evalEnd: data.registration_end_date || '',
				semester_start_date: data.semester_start_date || '',
			});
		} else {
			setFormData({
				name: '',
				startDate: '',
				endDate: '',
				evalStart: '',
				evalEnd: '',
				semester_start_date: '',
			});
		}
	}, [open, data]);

	const handleChange = (key, value) => {
		const formatted =
			value instanceof Date ? format(value, 'yyyy-MM-dd') : value;

		setFormData((prev) => ({
			...prev,
			[key]: formatted,
		}));
	};

	const handleSave = () => {
		if (toasterShown) return;
		setToasterShown(true);

		const normalizedName = formData.name.trim().toLowerCase();

		if (actionType === 'create') {
			const payload = {
				name: formData.name,
				admission_process_program: 1,
				enrollment_period: processData.id,
				registration_start_date: formData.startDate,
				registration_end_date: formData.endDate,
				examen_start_date: formData.evalStart,
				examen_end_date: formData.evalEnd,
				semester_start_date: formData.semester_start_date,
				credits: 1,
			};

			if (existingNames.includes(normalizedName)) {
				toaster.create({
					title: 'Ya existe un programa con este nombre',
					type: 'error',
					onStatusChange({ status }) {
						if (status === 'unmounted') setToasterShown(false);
					},
				});
				setToasterShown(true);
				return;
			}

			createEnrollmentsPrograms(payload, {
				onSuccess: () => {
					toaster.create({
						title: 'Proceso registrado correctamente',
						type: 'success',
						onStatusChange({ status }) {
							if (status === 'unmounted') setToasterShown(false);
						},
					});
					setToasterShown(true);
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
								([key, value]) =>
									`${Array.isArray(value) ? value.join(', ') : value}`
							)
							.join(', ');
					}

					toaster.create({
						title: errorMessage,
						type: 'error',
						onStatusChange({ status }) {
							if (status === 'unmounted') setToasterShown(false);
						},
					});

					setToasterShown(true);
				},
			});
		} else if (actionType === 'edit') {
			const payload = {
				name: formData.name,
				admission_process_program: 1,
				enrollment_period: processData.id,
				registration_start_date: formData.evalStart,
				registration_end_date: formData.evalEnd,
				examen_start_date: formData.startDate,
				examen_end_date: formData.endDate,
				semester_start_date: formData.semester_start_date,
				credits: 1,
			};

			const existingOtherNames = existingNames.filter(
				(name) => name !== data.program_name?.toLowerCase()
			);

			if (existingOtherNames.includes(normalizedName)) {
				toaster.create({
					title: 'Ya existe otro programa con este nombre',
					type: 'error',
					onStatusChange({ status }) {
						if (status === 'unmounted') setToasterShown(false);
					},
				});
				setToasterShown(true);
				return;
			}

			updateEnrollmentsPrograms(
				{ id: data.id, payload },
				{
					onSuccess: () => {
						toaster.create({
							title: 'Programa actualizado correctamente',
							type: 'success',
							onStatusChange({ status }) {
								if (status === 'unmounted') setToasterShown(false);
							},
						});
						setToasterShown(true);
						fetchData();
						onClose();
					},
					onError: (error) => {
						toaster.create({
							title: error.message || 'Error al actualizar el Programa',
							type: 'error',
							onStatusChange({ status }) {
								if (status === 'unmounted') setToasterShown(false);
							},
						});
						setToasterShown(true);
					},
				}
			);
		}
	};

	return (
		<Modal
			scrollBehavior='inside'
			title={
				actionType === 'edit'
					? 'Editar Programa de Matrícula'
					: 'Crear Programa de Matrícula'
			}
			placement='center'
			size='4xl'
			open={open}
			onOpenChange={(e) => {
				if (!e.open) onClose();
			}}
			onSave={handleSave}
			loading={isCreating || isUpdating}
			disabledSave={!isValid || isCreating || isUpdating || toasterShown}
			positionerProps={{ style: { padding: '0 40px' } }}
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
							<Field label='Nombre'>
								<Input
									type='text'
									value={formData.name}
									onChange={(e) => handleChange('name', e.target.value)}
									css={{ '--focus-color': '#000' }}
									rounded='md'
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
								<Field label='Fecha de inicio'>
									<CustomDatePicker
										selectedDate={formData.startDate}
										onDateChange={(date) => handleChange('startDate', date)}
										buttonSize='md'
										size='100%'
									/>
								</Field>
								<Field label='Fecha de fin'>
									<CustomDatePicker
										selectedDate={formData.endDate}
										onDateChange={(date) => handleChange('endDate', date)}
										buttonSize='md'
										size='150px'
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
								<Field label='Evaluación inicial'>
									<CustomDatePicker
										selectedDate={formData.evalStart}
										onDateChange={(date) => handleChange('evalStart', date)}
										buttonSize='md'
										size='150px'
									/>
								</Field>
								<Field label='Evaluación final'>
									<CustomDatePicker
										selectedDate={formData.evalEnd}
										onDateChange={(date) => handleChange('evalEnd', date)}
										buttonSize='md'
										size='150px'
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

					<Card.Body className='space-y-6'>
						<Box>
							<CustomDatePicker
								selectedDate={formData.semester_start_date}
								onDateChange={(date) =>
									handleChange('semester_start_date', date)
								}
								buttonSize='md'
								size='150px'
							/>
						</Box>
					</Card.Body>
				</Card.Root>

				{/* <Stack>
					<Field label='Nombre'>
						<Input
							type='text'
							value={formData.name}
							onChange={(e) => handleChange('name', e.target.value)}
							css={{ '--focus-color': '#000' }}
							rounded='md'
						/>
					</Field>
				</Stack>

				<Stack>
					<Heading size='md' color='uni.secondary'>
						Inscripción
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						<Field label='Fecha de inicio'>
							<CustomDatePicker
								selectedDate={formData.startDate}
								onDateChange={(date) => handleChange('startDate', date)}
								buttonSize='md'
								size='100%'
							/>
						</Field>
						<Field label='Fecha de fin'>
							<CustomDatePicker
								selectedDate={formData.endDate}
								onDateChange={(date) => handleChange('endDate', date)}
								buttonSize='md'
								size='150px'
							/>
						</Field>
					</SimpleGrid>
				</Stack>

				<Stack>
					<Heading size='md' color='uni.secondary'>
						Cronograma de evaluaciones
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						<Field label='Evaluación inicial'>
							<CustomDatePicker
								selectedDate={formData.evalStart}
								onDateChange={(date) => handleChange('evalStart', date)}
								buttonSize='md'
								size='150px'
							/>
						</Field>
						<Field label='Evaluación final'>
							<CustomDatePicker
								selectedDate={formData.evalEnd}
								onDateChange={(date) => handleChange('evalEnd', date)}
								buttonSize='md'
								size='150px'
							/>
						</Field>
					</SimpleGrid>
				</Stack>

				<Stack>
					<Heading size='md' color='uni.secondary'>
						Inicio de semestre
					</Heading>
					<CustomDatePicker
						selectedDate={formData.semester_start_date}
						onDateChange={(date) => handleChange('semester_start_date', date)}
						buttonSize='md'
						size='150px'
					/>
				</Stack> */}

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
	actionType: PropTypes.oneOf(['create', 'edit']),
};
