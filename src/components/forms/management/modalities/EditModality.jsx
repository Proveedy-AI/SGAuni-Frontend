import {
	Field,
	toaster,
	Modal,
	RadioGroup,
	Radio,
	Tooltip, // se cambio
} from '@/components/ui';
import {
	Box,
	Flex,
	IconButton,
	Input,
	Stack,
	Textarea,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useUpdateModality } from '@/hooks';
import PropTypes from 'prop-types';
import { HiPencil } from 'react-icons/hi2';

export const EditModality = ({ fetchData, item }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const { mutateAsync: update, isPending: loadingUpdate } = useUpdateModality();
	const [modalityEditable, setModalityEditable] = useState({
		...item,
		essay_weight: item.essay_weight * 100,
		interview_weight: item.interview_weight * 100,
	});

	const [errors, setErrors] = useState({});

	const validate = () => {
		const newErrors = {};

		if (!modalityEditable.name) newErrors.name = 'Falta nombre';
		if (!modalityEditable.description)
			newErrors.description = 'Falta descripción';
		if (
			!modalityEditable.min_grade ||
			modalityEditable.min_grade < 0 ||
			modalityEditable.min_grade > 20
		) {
			newErrors.min_grade = 'Debe estar entre 0 y 20';
		}

		if (
			modalityEditable.requires_essay &&
			(modalityEditable.essay_weight === '' ||
				modalityEditable.essay_weight < 0 ||
				modalityEditable.essay_weight > 100)
		) {
			newErrors.essay_weight = 'Debe estar entre 0 y 100';
		}

		if (
			modalityEditable.requires_interview &&
			(modalityEditable.interview_weight === '' ||
				modalityEditable.interview_weight < 0 ||
				modalityEditable.interview_weight > 100)
		) {
			newErrors.interview_weight = 'Debe estar entre 0 y 100';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleUpdate = async () => {
		// Compara si no hubo cambios
		if (JSON.stringify(modalityEditable) === JSON.stringify(item))
			return toaster.create({
				title: 'No se efectuaron cambios',
				type: 'info',
			});

		if (!validate()) return;

		const payload = {
			name: modalityEditable.name,
			description: modalityEditable.description,
			requires_pre_master_exam: modalityEditable.requires_pre_master_exam,
			min_grade: modalityEditable.min_grade,
			requires_essay: modalityEditable.requires_essay,
			essay_weight: modalityEditable.requires_essay
				? modalityEditable.essay_weight / 100
				: 0,
			requires_interview: modalityEditable.requires_interview,
			interview_weight: modalityEditable.requires_interview
				? modalityEditable.interview_weight / 100
				: 0,
		};
		if (
			!payload.name ||
			payload.price_credit <= 0 ||
			payload.coordinator === 0 ||
			payload.coordinator === null
		)
			return;

		await update(
			{ id: item.id, payload },
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
					toaster.create({
						title: error.message,
						type: 'error',
					});
				},
			}
		);
	};

	const handleWeightChange = (type, value) => {
		const numericValue = value === '' ? '' : Number(value);
		const otherType =
			type === 'essay_weight' ? 'interview_weight' : 'essay_weight';
		const otherKey =
			type === 'essay_weight' ? 'requires_interview' : 'requires_essay';
		const isOtherActive = modalityEditable[otherKey];

		// Si el otro está activo y numérico, ajusta al complemento
		if (
			isOtherActive &&
			typeof numericValue === 'number' &&
			numericValue >= 0 &&
			numericValue <= 100
		) {
			const adjustedOther = 100 - numericValue;
			setModalityEditable((prev) => ({
				...prev,
				[type]: numericValue,
				[otherType]: adjustedOther,
			}));
		} else {
			// Solo uno activo o valor en blanco
			setModalityEditable((prev) => ({
				...prev,
				[type]: numericValue,
			}));
		}
	};

	return (
		<Modal
			title='Editar Modalidad'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Editar'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton colorPalette='green' size='xs'>
							<HiPencil />
						</IconButton>
					</Tooltip>
				</Box>
			}
			size='xl'
			onSave={handleUpdate}
			loading={loadingUpdate}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack spacing={4}>
				<Field
					label='Nombre de la modalidad'
					invalid={!!errors.name}
					errorText={errors.name}
				>
					<Input
						value={modalityEditable.name}
						onChange={(e) =>
							setModalityEditable((prev) => ({
								...prev,
								name: e.target.value,
							}))
						}
					/>
				</Field>

				<Field
					label='Descripción'
					invalid={!!errors.description}
					errorText={errors.description}
				>
					<Textarea
						value={modalityEditable.description}
						onChange={(e) =>
							setModalityEditable((prev) => ({
								...prev,
								description: e.target.value,
							}))
						}
					/>
				</Field>

				<Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
					<Field label='Requiere pre-maestría'>
						<Flex align='center' gap={3}>
							<RadioGroup
								value={
									modalityEditable.requires_pre_master_exam ? 'true' : 'false'
								}
								onChange={(e) =>
									setModalityEditable((prev) => ({
										...prev,
										requires_pre_master_exam: e.target.value === 'true',
									}))
								}
							>
								<Flex gap={5}>
									<Radio value='true'>Sí</Radio>
									<Radio value='false'>No</Radio>
								</Flex>
							</RadioGroup>
						</Flex>
					</Field>

					<Field
						label='Nota mínima (0 a 20)'
						invalid={!!errors.min_grade}
						errorText={errors.min_grade}
					>
						<Input
							type='number'
							value={modalityEditable.min_grade}
							placeholder='Ingrese la nota mínima (0 a 20)'
							onChange={(e) =>
								setModalityEditable((prev) => ({
									...prev,
									min_grade: e.target.value,
								}))
							}
							min={0}
							max={20}
							step={0.5}
						/>
					</Field>
				</Flex>

				<Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
					<Field label='Requiere ensayo'>
						<RadioGroup
							value={modalityEditable.requires_essay ? 'true' : 'false'}
							onChange={(e) => {
								const requiresEssay = e.target.value === 'true';
								setModalityEditable((prev) => {
									const updated = {
										...prev,
										requires_essay: requiresEssay,
										essay_weight: requiresEssay
											? prev.requires_interview
												? 50
												: 100
											: 0,
									};
									if (!requiresEssay && !prev.requires_interview) {
										updated.essay_weight = 0;
										updated.interview_weight = 0;
									}
									if (!requiresEssay && prev.requires_interview) {
										updated.interview_weight = 100;
									}
									return updated;
								});
							}}
						>
							<Flex gap={5}>
								<Radio value='true'>Sí</Radio>
								<Radio value='false'>No</Radio>
							</Flex>
						</RadioGroup>
					</Field>

					{modalityEditable.requires_essay && (
						<Field
							label='Peso del ensayo (0 a 100)%'
							invalid={!!errors.essay_weight}
							errorText={errors.essay_weight}
						>
							<Input
								required
								type='number'
								value={modalityEditable.essay_weight}
								onChange={(e) =>
									handleWeightChange('essay_weight', e.target.value)
								}
								min={0}
								max={100}
								step={1}
								placeholder='Ej: 50'
								disabled={
									modalityEditable.requires_essay &&
									!modalityEditable.requires_interview
								}
							/>
						</Field>
					)}
				</Flex>

				<Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
					<Field label='Requiere entrevista personal'>
						<RadioGroup
							value={modalityEditable.requires_interview ? 'true' : 'false'}
							onChange={(e) => {
								const requiresInterview = e.target.value === 'true';
								setModalityEditable((prev) => {
									const updated = {
										...prev,
										requires_interview: requiresInterview,
										interview_weight: requiresInterview
											? prev.requires_essay
												? 50
												: 100
											: 0,
									};
									if (!requiresInterview && !prev.requires_essay) {
										updated.essay_weight = 0;
										updated.interview_weight = 0;
									}
									if (!requiresInterview && prev.requires_essay) {
										updated.essay_weight = 100;
									}
									return updated;
								});
							}}
						>
							<Flex gap={5}>
								<Radio value='true'>Sí</Radio>
								<Radio value='false'>No</Radio>
							</Flex>
						</RadioGroup>
					</Field>

					{modalityEditable.requires_interview && (
						<Field
							label='Peso de la entrevista (0 a 100)%'
							invalid={!!errors.interview_weight}
							errorText={errors.interview_weight}
						>
							<Input
								type='number'
								value={modalityEditable.interview_weight}
								onChange={(e) =>
									handleWeightChange('interview_weight', e.target.value)
								}
								min={0}
								max={100}
								step={1}
								placeholder='Ej: 50'
								disabled={
									modalityEditable.requires_interview &&
									!modalityEditable.requires_essay
								}
							/>
						</Field>
					)}
				</Flex>
			</Stack>
		</Modal>
	);
};

EditModality.propTypes = {
	fetchData: PropTypes.func,
	item: PropTypes.object,
};
