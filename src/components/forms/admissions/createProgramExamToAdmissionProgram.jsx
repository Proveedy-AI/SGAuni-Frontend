import { ReactSelect } from '@/components/select';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import {
	useCreateAdmissionEvaluation,
	useDeleteAdmissionEvaluation,
	useReadAdmissionEvaluationsByApplication,
	useUpdateAdmissionEvaluation,
} from '@/hooks/admissions_evaluations';
import { useReadAdmissionEvaluators } from '@/hooks/admissions_evaluators';
import {
	Box,
	Flex,
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
import { FiCalendar } from 'react-icons/fi';

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
	const { data: dataEvaluators, isLoading: evaluatorsLoading } =
		useReadAdmissionEvaluators({
			program_id: item?.admission_program,
      options: {
        enabled: open,
      },
		});
	const evaluatorOptions = dataEvaluators?.results?.map((evaluator) => {
		return {
			value: evaluator.evaluator,
			label: evaluator.evaluator_display,
		};
	});

	const applicationTypeOptions = [
		{ value: 1, label: 'Ensayo' },
		{ value: 2, label: 'Entrevista' },
		{ value: 3, label: 'Examen' },
	];

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
						content='Programar tareas'
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
			<Stack spacing={4} css={{ '--field-label-width': '150px' }}>
				{/* Formulario para Examen */}
				<Flex direction='column' gap={4} mt={2}>
					<Flex
						direction={{ base: 'column', md: 'row' }}
						w='full'
						gap={4}
						align={{ base: 'start', md: 'end' }}
					>
						<Field label='Fecha de inicio:' w='full'>
							<CustomDatePicker
								selectedDate={startDateExamInput}
								onDateChange={(date) => setStartDateExamInput(format(date, 'yyyy-MM-dd'))}
								placeholder='Selecciona una fecha de inicio'
								buttonSize='md'
								size={{ base: '330px', md: '250px' }}
							/>
						</Field>

						<Field label='Fecha de fin:' w='full'>
							<CustomDatePicker
								selectedDate={endDateExamInput}
								onDateChange={(date) => setEndDateExamInput(format(date, 'yyyy-MM-dd'))}
								placeholder='Selecciona una fecha de fin'
								buttonSize='md'
								size={{ base: '330px', md: '250px' }}
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
					</Flex>

					<Flex
						direction={{ base: 'column', md: 'row' }}
						w='full'
						gap={6}
						align={{ base: 'start', md: 'end' }}
					>
						<Field label='Tipo de Examen' w='full'>
							<ReactSelect
								value={applicationTypeInput}
								options={applicationTypeOptions}
								onChange={(value) => setApplicationTypeInput(value)}
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

						<Flex
							gap={2}
							mt={{ base: 2, md: 0 }}
							alignSelf={{ base: 'flex-end', md: 'auto' }}
						>
							<IconButton
								size='sm'
								bg='green'
								disabled={!startDateExamInput || !timeExamInput}
								onClick={handleSubmit}
								isLoading={isCreateEvaluationPending || isEditEvaluationPending}
								css={{ _icon: { width: '5', height: '5' } }}
								aria-label={editingId ? 'Actualizar' : 'Guardar'}
							>
								<FaSave />
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
					</Flex>
				</Flex>

				{/* Tabla de Exámenes */}
				<Box mt={6}>
					<Text fontWeight='semibold' mb={2}>
						Exámenes Asignados:
					</Text>
					<Table.Root size='sm' striped>
						<Table.Header>
							<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
								<Table.ColumnHeader>N°</Table.ColumnHeader>
								<Table.ColumnHeader>Nombre</Table.ColumnHeader>
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
													<FaSave />
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
									<Table.Cell colSpan={5} textAlign='center'>
										Sin datos disponibles
									</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table.Root>
				</Box>
			</Stack>
		</Modal>
	);
};

CreateProgramExamToAdmissionProgram.propTypes = {
	item: PropTypes.object.isRequired,
	fetchData: PropTypes.func.isRequired,
};
