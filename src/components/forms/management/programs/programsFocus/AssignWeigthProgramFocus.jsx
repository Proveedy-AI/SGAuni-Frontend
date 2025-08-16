import { ReactSelect } from '@/components/select';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import { useCreateProgramWeight } from '@/hooks/programs/programsFocus/useCreateProgramWeight';
import { useDeleteProgramWeight } from '@/hooks/programs/programsFocus/useDeleteProgramWeight';
import { useReadProgramsWeigth } from '@/hooks/programs/programsFocus/useReadProgramsWeigth';
import { useUpdateProgramsWeight } from '@/hooks/programs/programsFocus/useUpdateProgramsWeight';
import {
	Box,
	Flex,
	IconButton,
	Input,
	Spinner,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { FiCheckSquare, FiTrash2 } from 'react-icons/fi';

export const AssignWeigthProgramFocus = ({ item, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [evaluatorRequest, setEvaluatorRequest] = useState({
		evaluation_type: null,
		evaluation_weight: '',
	});
	const {
		data: dataProgramsWeight,
		isLoading: loadingProgramsWeight,
		refetch: fetchProgramsWeight,
	} = useReadProgramsWeigth({}, { enabled: open });

	const [errors, setErrors] = useState({});

	const roleOptions = [
		{ label: 'Ensayo', value: '1' },
		{ label: 'Entrevista personal', value: '3' },
	];

	const evaluatorsAssigned = dataProgramsWeight?.results?.filter(
		(evaluator) => evaluator.postgraduate_focus === item.id
	);

	const assignedValues = evaluatorsAssigned.map((e) =>
		String(e.evaluation_type)
	);

	const availableOptions = roleOptions.filter(
		(option) => !assignedValues.includes(option.value)
	);

	const totalAssignedWeight = evaluatorsAssigned.reduce(
		(acc, ev) => acc + (Number(ev.evaluation_weight) || 0),
		0
	);

	const maxRemaining = Math.max(0, 101 - totalAssignedWeight);

	const { mutateAsync: assignEvaluator, isPending: isSaving } =
		useCreateProgramWeight();
	const { mutateAsync: updateAssignment } = useUpdateProgramsWeight();
	const { mutate: deleteAssignment } = useDeleteProgramWeight();

	const handleResetForm = () => {
		setEvaluatorRequest({
			evaluation_type: null,
			evaluation_weight: '',
		});
		setEditingId(null);
	};

	const validateFields = () => {
		const newErrors = {};
		if (!evaluatorRequest.evaluation_type)
			newErrors.evaluation_type = 'El tipo de evaluación es requerido';
		if (!evaluatorRequest.evaluation_weight)
			newErrors.evaluation_weight = 'El peso de evaluación es requerido';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateFields()) return;

		const payload = {
			postgraduate_focus: item.id,
			evaluation_weight: evaluatorRequest.evaluation_weight / 100,
			evaluation_type: Number(evaluatorRequest.evaluation_type.value),
		};

		const onSuccess = () => {
			toaster.create({
				title: editingId ? 'Asignación actualizada' : 'Asignación creada',
				type: 'success',
			});
			handleResetForm();
			fetchProgramsWeight();
			fetchData();
		};

		const onError = (error) => {
			toaster.create({
				title: error.response?.data?.[0] || 'Error en la asignación',
				type: 'error',
			});
		};

		if (editingId) {
			updateAssignment({ id: editingId, payload }, { onSuccess, onError });
		} else {
			assignEvaluator(payload, { onSuccess, onError });
		}
	};

	const handleDelete = (id) => {
		deleteAssignment(id, {
			onSuccess: () => {
				toaster.create({ title: 'Asignación eliminada', type: 'info' });
				handleResetForm();
				fetchProgramsWeight();
				fetchData();
			},
			onError: (error) => {
				toaster.create({
					title: error.response?.data?.[0] || 'Error al eliminar',
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Asignar/Quitar Pesos de Evaluación'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Pesos de Evaluación'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton p={2} colorPalette='orange' size='xs'>
							<FiCheckSquare /> Asignar Pesos
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
			{loadingProgramsWeight ? (
				<Flex justify='center' align='center' minH='200px'>
					<Spinner size='xl' />
				</Flex>
			) : (
				<Stack spacing={4} css={{ '--field-label-width': '150px' }}>
					<Flex
						direction={{ base: 'column', md: 'row' }}
						justify='flex-start'
						align={'end'}
						gap={2}
						mt={2}
					>
						<Field
							label='Tipo de evaluación'
							invalid={!!errors.evaluation_type}
							errorMessage={errors.evaluation_type}
							required
						>
							<ReactSelect
								options={availableOptions}
								value={evaluatorRequest.evaluation_type}
								onChange={(value) =>
									setEvaluatorRequest((prev) => ({
										...prev,
										evaluation_type: value,
									}))
								}
							/>
						</Field>
						<Field
							label='Peso (0 a 100)%'
							invalid={!!errors.evaluation_weight}
							errorMessage={errors.evaluation_weight}
							required
						>
							<Input
								type='number'
								min={0}
								max={maxRemaining} // 👈 restricción
								value={evaluatorRequest.evaluation_weight}
								onChange={(e) => {
									const value = Number(e.target.value);
									if (value <= maxRemaining) {
										setEvaluatorRequest((prev) => ({
											...prev,
											evaluation_weight: value,
										}));
									}
								}}
								placeholder={`Máximo permitido: ${maxRemaining}%`}
								disabled={maxRemaining === 0} // 👈 si ya es 100, deshabilitar
							/>
						</Field>
						<IconButton
							size='sm'
							bg='uni.secondary'
							loading={isSaving}
							disabled={
								!evaluatorRequest.evaluation_type ||
								!evaluatorRequest.evaluation_weight
							}
							onClick={handleSubmit}
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<FaSave />
						</IconButton>
					</Flex>
					<Box mt={6}>
						<Text fontWeight='semibold' mb={2}>
							Pesos Asignados:
						</Text>
						<Table.Root size='sm' striped>
							<Table.Header>
								<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
									<Table.ColumnHeader>N°</Table.ColumnHeader>
									<Table.ColumnHeader>Evaluación</Table.ColumnHeader>
									<Table.ColumnHeader>Peso (0 a 100)%</Table.ColumnHeader>
									<Table.ColumnHeader>Acciones</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{evaluatorsAssigned?.map((item, index) => (
									<Table.Row
										key={item.id}
										bg={{ base: 'white', _dark: 'its.gray.500' }}
									>
										<Table.Cell>{index + 1}</Table.Cell>
										<Table.Cell>
											{roleOptions.find(
												(opt) => opt.value === String(item.evaluation_type)
											)?.label || item.evaluation_type}
										</Table.Cell>
										<Table.Cell>{item.evaluation_weight * 100}</Table.Cell>

										<Table.Cell>
											<Flex gap={2}>
												<IconButton
													size='xs'
													colorPalette='red'
													onClick={() => handleDelete(item.id)}
													aria-label='Eliminar'
												>
													<FiTrash2 />
												</IconButton>
											</Flex>
										</Table.Cell>
									</Table.Row>
								))}
								{evaluatorsAssigned?.length === 0 && (
									<Table.Row>
										<Table.Cell colSpan={7} textAlign='center'>
											Sin datos disponibles
										</Table.Cell>
									</Table.Row>
								)}
							</Table.Body>
						</Table.Root>
					</Box>
				</Stack>
			)}
		</Modal>
	);
};

AssignWeigthProgramFocus.propTypes = {
	item: PropTypes.object,
	fetchData: PropTypes.func,
};
