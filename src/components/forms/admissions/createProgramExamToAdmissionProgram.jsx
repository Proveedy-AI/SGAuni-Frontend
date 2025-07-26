import { ReactSelect } from '@/components/select';
import { Alert, Field, Modal, toaster, Tooltip } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { useReadOneModality } from '@/hooks';
import {
	useCreateAdmissionEvaluation,
	useDeleteAdmissionEvaluation,
	useReadAdmissionEvaluationsByApplication,
	useUpdateAdmissionEvaluation,
} from '@/hooks/admissions_evaluations';
import { useReadUsers } from '@/hooks/users';
import {
	Badge,
	Box,
	Card,
	Flex,
	Grid,
	GridItem,
	Icon,
	IconButton,
	Input,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import {
	FiAlertTriangle,
	FiCalendar,
	FiCheckCircle,
	FiEdit,
	FiPlus,
	FiUser,
} from 'react-icons/fi';

export const CreateProgramExamToAdmissionProgram = ({ item, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const { mutate: createEvaluation, isPending: isCreateEvaluationPending } =
		useCreateAdmissionEvaluation();
	const { data: dataEvaluations, refetch: fetchEvaluations } =
		useReadAdmissionEvaluationsByApplication(item?.id, open);
	const { mutate: editEvaluation, isPending: isEditEvaluationPending } =
		useUpdateAdmissionEvaluation();
	const { mutate: deleteEvaluation, isPending: isDeleteEvaluationPending } =
		useDeleteAdmissionEvaluation();

	const { data: dataModality } = useReadOneModality({
		id: item?.modality_id,
		enabled: open,
	});

	const { data: dataUsers, isLoading: evaluatorsLoading } = useReadUsers(
		{},
		{
			enabled: open,
		}
	);
	const evaluatorOptions = dataUsers?.results
		?.filter(
			(c) =>
				c?.is_active === true &&
				Array.isArray(c?.roles) &&
				c.roles.some((role) => role?.name === 'Docente')
		)
		?.map((c) => ({
			value: c.id.toString(),
			label: c.full_name,
		}));

	const applicationTypeOptions = [
		{ value: 1, label: 'Ensayo', key: 'requires_essay' },
		{ value: 2, label: 'Entrevista', key: 'requires_interview' },
		{ value: 3, label: 'Examen', key: 'requires_pre_master_exam' },
	];

	const filteredApplicationTypeOptions = applicationTypeOptions.filter(
		(option) => dataModality?.[option.key]
	);

	const filteredEvaluationsByStudent = dataEvaluations?.results?.filter(
		(evaluation) => evaluation.application === item?.id
	);

	const [startDateExamInput, setStartDateExamInput] = useState('');
	const [endDateExamInput, setEndDateExamInput] = useState('');
	const [timeExamInput, setTimeExamInput] = useState('');
	const [evaluatorInput, setEvaluatorInput] = useState(null);
	const [applicationTypeInput, setApplicationTypeInput] = useState(null);
	const [editingId, setEditingId] = useState(null);

	const handleResetForm = () => {
		setStartDateExamInput('');
		setEndDateExamInput('');
		setTimeExamInput('');
		setEvaluatorInput(null);
		setApplicationTypeInput(null);
		setEditingId(null);
	};

	const handleSubmit = () => {
		if (
			!startDateExamInput ||
			!timeExamInput ||
			!endDateExamInput ||
			!evaluatorInput ||
			!applicationTypeInput
		) {
			toaster.create({
				title: 'Completa todos los campos obligatorios',
				type: 'warning',
			});
			return;
		}

		const payload = {
			application: item?.id,
			type_application: applicationTypeInput?.value,
			start_date: startDateExamInput,
			end_date: endDateExamInput,
			evaluator: evaluatorInput?.value,
			evaluation_time: timeExamInput,
		};

		const onSuccess = () => {
			toaster.create({
				title: editingId ? 'Examen actualizado' : 'Examen creado',
				type: 'success',
			});
			handleResetForm();
			fetchData();
			fetchEvaluations();
		};

		const onError = (error) => {
			console.error(error);
			toaster.create({
				title: error.response?.data?.[0] || 'Error en la creación del examen',
				type: 'error',
			});
		};

		if (editingId) {
			editEvaluation({ id: editingId, payload }, { onSuccess, onError });
		} else {
			createEvaluation(payload, { onSuccess, onError });
		}
	};

	const handleDelete = (id) => {
		deleteEvaluation(id, {
			onSuccess: () => {
				toaster.create({
					title: 'Examen eliminado',
					type: 'success',
				});
				fetchData();
				fetchEvaluations();
			},
			onError: (error) => {
				console.error(error);
				toaster.create({
					title: error.response?.data?.[0] || 'Error al eliminar el examen',
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Programar Tareas'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Programar Evaluaciones'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='green'
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<FiCalendar />
						</IconButton>
					</Tooltip>
				</Box>
			}
			size='4xl'
			open={open}
			hiddenFooter={true}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack
				gap={2}
				pb={6}
				maxH={{ base: 'full', md: '85vh' }}
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': { width: '6px' },
					'&::-webkit-scrollbar-thumb': {
						background: 'gray.300',
						borderRadius: 'full',
					},
				}}
			>
				<Card.Root
					borderLeft='4px solid'
					borderLeftColor='green.500'
					bg='white'
				>
					<Card.Header>
						<Flex align='center' gap={2}>
							<Icon as={FiUser} boxSize={5} color='green.600' />
							<Text fontSize='16px' fontWeight='bold'>
								Información del Postulante
							</Text>
						</Flex>
					</Card.Header>

					<Card.Body>
						<Grid
							gap={2}
							templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
						>
							<GridItem>
								<Text fontSize='sm' color='gray.600' fontWeight='medium'>
									Postulante
								</Text>
								<Text fontSize='20px' fontWeight='semibold' color='gray.900'>
									{item.person_full_name}
								</Text>
							</GridItem>

							<GridItem>
								<Text fontSize='sm' color='gray.600' fontWeight='medium'>
									Programa
								</Text>
								<Text
									fontSize='20px'
									fontWeight='medium'
									color='gray.900'
									mt={1}
								>
									{item.postgrade_name}
								</Text>
							</GridItem>

							<GridItem>
								<Text fontSize='sm' color='gray.600' fontWeight='medium'>
									Modalidad
								</Text>
								<Text
									fontSize='20px'
									fontWeight='medium'
									color='gray.900'
									mt={1}
								>
									{item.modality_display}
								</Text>
							</GridItem>
						</Grid>
					</Card.Body>
				</Card.Root>
				<Card.Root>
					<Card.Header>
						<Flex align='center' gap={2}>
							<Icon as={FiPlus} boxSize={5} color='green.600' />
							<Text fontSize='16px' fontWeight='bold'>
								{editingId ? 'Editar Evaluación' : 'Programar Nueva Evaluación'}
							</Text>
						</Flex>
					</Card.Header>

					<Card.Body>
						<Grid
							templateColumns={{
								base: '1fr',
								md: 'repeat(2, 1fr)',
								lg: 'repeat(3, 1fr)',
							}}
							gap={4}
							mb={4}
						>
							<Field label='Fecha de inicio:' w='full'>
								<CustomDatePicker
									selectedDate={startDateExamInput}
									onDateChange={(date) =>
										setStartDateExamInput(format(date, 'yyyy-MM-dd'))
									}
									placeholder='Selecciona una fecha de inicio'
									buttonSize='md'
									minDate={new Date()}
									size={{ base: '280px', md: '250px' }}
								/>
							</Field>

							<Field label='Fecha de fin:' w='full'>
								<CustomDatePicker
									selectedDate={endDateExamInput}
									onDateChange={(date) =>
										setEndDateExamInput(format(date, 'yyyy-MM-dd'))
									}
									placeholder='Selecciona una fecha de fin'
									buttonSize='md'
									size={{ base: '280px', md: '250px' }}
									minDate={new Date()}
								/>
							</Field>

							<Field label='Hora:' w='full'>
								<Input
									type='time'
									value={timeExamInput}
									onChange={(e) => setTimeExamInput(e.target.value)}
									size='sm'
								/>
							</Field>
						</Grid>

						<Grid
							templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
							mb={6}
							gap={4}
						>
							<Field label='Tipo de Examen' w='full'>
								<ReactSelect
									value={applicationTypeInput}
									options={filteredApplicationTypeOptions}
									onChange={(value) => setApplicationTypeInput(value)}
									isDisabled={filteredApplicationTypeOptions.length === 0}
									placeholder={
										filteredApplicationTypeOptions.length === 0
											? 'Esta modalidad no requiere evaluaciones'
											: 'Selecciona un tipo'
									}
								/>
							</Field>

							<Field label='Evaluador:' w='full'>
								<ReactSelect
									value={evaluatorInput}
									options={evaluatorOptions}
									isLoading={evaluatorsLoading}
									onChange={(value) => setEvaluatorInput(value)}
								/>
							</Field>
						</Grid>

						<Flex gap={3}>
							<IconButton
								size='sm'
								bg='green'
								p={4}
								disabled={
									!startDateExamInput ||
									!timeExamInput ||
									!evaluatorInput ||
									!applicationTypeInput
								}
								onClick={handleSubmit}
								loading={isCreateEvaluationPending || isEditEvaluationPending}
								loadingText={editingId ? 'Actualizando...' : 'Guardando...'}
								css={{ _icon: { width: '5', height: '5' } }}
								aria-label={editingId ? 'Actualizar' : 'Guardar'}
							>
								<FaSave /> {editingId ? 'Actualizar' : 'Guardar'}
							</IconButton>
							<IconButton
								size='sm'
								bg='red'
								disabled={!startDateExamInput || !timeExamInput}
								onClick={handleResetForm}
								css={{ _icon: { width: '5', height: '5' } }}
								aria-label='Cancelar'
							>
								<FaTimes />
							</IconButton>
						</Flex>

						{editingId && (
							<Alert
								status='info'
								mt={6}
								bg='blue.50'
								border='1px solid'
								borderColor='blue.200'
								icon={<FiAlertTriangle></FiAlertTriangle>}
							>
								Estás editando una evaluación existente. Los cambios se
								aplicarán al guardar.
							</Alert>
						)}
					</Card.Body>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Flex align='center' justify='space-between'>
							<Flex align='center' gap={2}>
								<Icon as={FiCheckCircle} boxSize={5} color='blue.600' />
								<Text fontSize='16px' fontWeight='bold'>
									Evaluaciones Programadas
								</Text>
								<Badge
									variant='outline'
									bg='blue.50'
									color='blue.700'
									borderColor='blue.200'
								>
									{filteredEvaluationsByStudent?.length} evaluaciones
								</Badge>
							</Flex>
						</Flex>
					</Card.Header>

					<Card.Body>
						<Table.Root size='sm' striped>
							<Table.Header>
								<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
									<Table.ColumnHeader>N°</Table.ColumnHeader>
									<Table.ColumnHeader>Evaluador</Table.ColumnHeader>
									<Table.ColumnHeader>Evaluación</Table.ColumnHeader>
									<Table.ColumnHeader>Fecha de Inicio</Table.ColumnHeader>
									<Table.ColumnHeader>Fecha de Fin</Table.ColumnHeader>
									<Table.ColumnHeader>Hora</Table.ColumnHeader>
									<Table.ColumnHeader>Acciones</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{filteredEvaluationsByStudent?.length > 0 ? (
									filteredEvaluationsByStudent.map((exam, index) => (
										<Table.Row key={exam.id}>
											<Table.Cell>{index + 1}</Table.Cell>
											<Table.Cell>{exam.evaluator_full_name}</Table.Cell>
											<Table.Cell>{exam.type_application_display}</Table.Cell>
											<Table.Cell>{exam.start_date}</Table.Cell>
											<Table.Cell>{exam.end_date}</Table.Cell>
											<Table.Cell>{exam.evaluation_time}</Table.Cell>
											<Table.Cell>
												<Flex gap={2}>
													<IconButton
														size='xs'
														colorPalette='blue'
														onClick={() => {
															setEditingId(exam?.id);
															setStartDateExamInput(exam?.start_date);
															setEndDateExamInput(exam?.end_date);
															setTimeExamInput(exam?.evaluation_time);
															setEvaluatorInput({
																value: exam?.evaluator,
																label: exam?.evaluator_full_name,
															});
															setApplicationTypeInput({
																value: exam?.type_application,
																label: applicationTypeOptions.find(
																	(option) =>
																		option.value === exam?.type_application
																)?.label,
															});
														}}
														aria-label='Editar'
													>
														<FiEdit />
													</IconButton>
													<IconButton
														size='xs'
														colorPalette='red'
														isLoading={isDeleteEvaluationPending}
														onClick={() => {
															handleDelete(exam.id);
														}}
														aria-label='Eliminar'
													>
														<FaTimes />
													</IconButton>
												</Flex>
											</Table.Cell>
										</Table.Row>
									))
								) : (
									<Table.Row>
										<Table.Cell colSpan={7} textAlign='center'>
											Sin datos disponibles
										</Table.Cell>
									</Table.Row>
								)}
							</Table.Body>
						</Table.Root>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

CreateProgramExamToAdmissionProgram.propTypes = {
	item: PropTypes.object.isRequired,
	fetchData: PropTypes.func.isRequired,
};
