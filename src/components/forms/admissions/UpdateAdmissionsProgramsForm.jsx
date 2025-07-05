import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import {
	Box,
	Card,
	Flex,
	Heading,
	Icon,
	IconButton,
	List,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import {
	FiBookOpen,
	FiCalendar,
	FiCheckCircle,
	FiClock,
	FiEdit2,
	FiUsers,
} from 'react-icons/fi';
import { ReactSelect } from '@/components/select';
import { useReadPrograms } from '@/hooks';
import { useUpdateAdmissionsPrograms } from '@/hooks/admissions_programs';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';
import { LuGraduationCap } from 'react-icons/lu';

export const UpdateAdmissionsProgramsForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [registrationStart, setRegistrationStart] = useState(
		data?.registration_start_date
	);
	const [registrationEnd, setRegistrationEnd] = useState(
		data?.registration_end_date
	);
	const [examStart, setExamStart] = useState(data?.exam_date_start);
	const [examEnd, setExamEnd] = useState(data?.exam_date_end);
	const [semesterStart, setSemesterStart] = useState(data?.semester_start_date);
	const [selectedMode, setSelectedMode] = useState({
		value: data?.study_mode,
		label: data?.study_mode_display,
	});
	const [selectedProgram, setSelectedProgram] = useState({
		value: data?.program,
		label: data?.program_name,
	});
	const [errors, setErrors] = useState({});
	const { mutate: updateAdmissionsPrograms, isPending } =
		useUpdateAdmissionsPrograms();
	const { data: dataPrograms } = useReadPrograms(
		{
			coordinator_id: data?.coordinator,
		},
		{ enabled: open }
	);

	const validateFields = () => {
		const newErrors = {};

		if (!selectedMode) newErrors.selectedMode = 'Seleccione un modo de estudio';
		if (!selectedProgram) newErrors.selectedProgram = 'Seleccione un programa';
		if (!registrationStart)
			newErrors.registrationStart =
				'Fecha de inicio de inscripción es requerida';
		if (!registrationEnd)
			newErrors.registrationEnd = 'Fecha de fin de inscripción es requerida';
		if (!examStart)
			newErrors.examStart = 'Fecha de inicio de examen es requerida';
		if (!examEnd) newErrors.examEnd = 'Fecha de fin de examen es requerida';
		if (!semesterStart)
			newErrors.semesterStart = 'Fecha de inicio de semestre es requerida';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = (e) => {
		e.preventDefault();

		if (!validateFields()) return;

		const payload = {
			study_mode: selectedMode.value,
			admission_process: data.admission_process,
			program: selectedProgram.value,
			registration_start_date: registrationStart,
			registration_end_date: registrationEnd,
			exam_date_start: examStart,
			exam_date_end: examEnd,
			semester_start_date: semesterStart,
			editable: true,
		};

		updateAdmissionsPrograms(
			{ id: data.id, payload },
			{
				onSuccess: () => {
					toaster.create({
						title: 'Programa actualizado correctamente',
						type: 'success',
					});
					setOpen(false);
					fetchData();
				},
				onError: (error) => {
					console.error(error);
					toaster.create({
						title:
							error.response?.data?.[0] || 'Error al Actualizar el Programa',
						type: 'error',
					});
				},
			}
		);
	};

	const dataMode = [
		{ label: 'Virtual', value: 1 },
		{ label: 'Semi-Presencial', value: 2 },
		{ label: 'Presencial', value: 3 },
	];

	const ProgramsOptions = dataPrograms?.results?.map((department) => ({
		label: department.name,
		value: department.id,
	}));

	return (
		<Modal
			title='Editar Programa de Admisión'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Editar'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='cyan'
							disabled={data.status === 4}
							css={{
								_icon: {
									width: '5',
									height: '5',
								},
							}}
						>
							<FiEdit2 />
						</IconButton>
					</Tooltip>
				</Box>
			}
			onSave={handleSubmitData}
			size='4xl'
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
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
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
							<Field
								label='Programa Académico:'
								invalid={!!errors.selectedProgram}
								errorText={errors.selectedProgram}
								required
							>
								<ReactSelect
									value={selectedProgram}
									onChange={setSelectedProgram}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={ProgramsOptions}
								/>
							</Field>
							<Field
								label='Modo de estudio:'
								invalid={!!errors.selectedMode}
								errorText={errors.selectedMode}
								required
							>
								<ReactSelect
									value={selectedMode}
									onChange={setSelectedMode}
									variant='flushed'
									isClearable
									size='xs'
									isSearchable
									options={dataMode}
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
							Fechas del Proceso de Admisión
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
									label='Fecha de Inicio:'
									invalid={!!errors.registrationStart}
									errorText={errors.registrationStart}
									required
								>
									<CustomDatePicker
										selectedDate={registrationStart}
										onDateChange={(date) =>
											setRegistrationStart(format(date, 'yyyy-MM-dd'))
										}
										buttonSize='xs'
										size={{ base: '280px', md: '350px' }}
										minDate={new Date()}
									/>
								</Field>

								<Field
									label='Fecha de Cierre:'
									invalid={!!errors.registrationEnd}
									errorText={errors.registrationEnd}
									required
								>
									<CustomDatePicker
										selectedDate={registrationEnd}
										onDateChange={(date) =>
											setRegistrationEnd(format(date, 'yyyy-MM-dd'))
										}
										buttonSize='xs'
										size={{ base: '280px', md: '350px' }}
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
									label='Fecha de inicio:'
									invalid={!!errors.examStart}
									errorText={errors.examStart}
									required
								>
									<CustomDatePicker
										selectedDate={examStart}
										onDateChange={(date) =>
											setExamStart(format(date, 'yyyy-MM-dd'))
										}
										buttonSize='xs'
										size={{ base: '280px', md: '350px' }}
										minDate={new Date()}
									/>
								</Field>

								<Field
									label='Fecha de finalización:'
									invalid={!!errors.examEnd}
									errorText={errors.examEnd}
									required
								>
									<CustomDatePicker
										selectedDate={examEnd}
										onDateChange={(date) =>
											setExamEnd(format(date, 'yyyy-MM-dd'))
										}
										buttonSize='sm'
										size={{ base: '280px', md: '350px' }}
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

					<Card.Body className='space-y-6'>
						<Box>
							<Field
								label='Inicio de semestre:'
								invalid={!!errors.semesterStart}
								errorText={errors.semesterStart}
								required
							>
								<CustomDatePicker
									selectedDate={semesterStart}
									onDateChange={(date) => {
										const formatted = format(date, 'yyyy-MM-dd');
										setSemesterStart(formatted);
									}}
									buttonSize='xs'
									size={{ base: '280px', md: '750px' }}
									minDate={new Date()}
								/>
							</Field>
						</Box>
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
									con el proceso de admisión.
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
								Importante: No se podrá activar el proceso de admisión si el
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

UpdateAdmissionsProgramsForm.propTypes = {
	fetchData: PropTypes.func.isRequired,
	data: PropTypes.object,
};
