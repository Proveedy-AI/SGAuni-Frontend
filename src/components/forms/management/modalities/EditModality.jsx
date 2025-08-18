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
import { useEffect, useRef, useState } from 'react';
import { useReadProgramTypes, useUpdateModality } from '@/hooks';
import PropTypes from 'prop-types';
import { HiPencil } from 'react-icons/hi2';
import { ReactSelect } from '@/components/select';

export const EditModality = ({ fetchData, item }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const { mutateAsync: update, isPending: loadingUpdate } = useUpdateModality();
	const [modalityEditable, setModalityEditable] = useState({
		name: item.name,
		description: item.description,
		type: null,
		requires_pre_master_exam: item.requires_pre_master_exam,
		pre_master_min_grade: item.pre_master_min_grade,
		requires_essay: item.requires_essay,
		requires_interview: item.requires_interview,
	});

	const [errors, setErrors] = useState({});

	const { data: dataProgramTypes, isLoading: loadingProgramTypes } =
		useReadProgramTypes({}, { enabled: open });

	const programTypesOptions = dataProgramTypes?.results?.map((item) => ({
		value: item.id.toString(),
		label: item.name,
	}));

	useEffect(() => {
		if (open && dataProgramTypes?.results?.length) {
			const selected = dataProgramTypes.results.find(
				(pt) => pt.id === item.postgraduate_type
			);

			if (selected) {
				setModalityEditable((prev) => ({
					...prev,
					postgraduate_type: {
						value: selected.id.toString(),
						label: selected.name,
					},
				}));
			}
		}
	}, [open, dataProgramTypes, item.postgraduate_type]);

	const validate = () => {
		const newErrors = {};

		if (!modalityEditable.name) newErrors.name = 'Falta nombre';
		if (!modalityEditable.description)
			newErrors.description = 'Falta descripción';
		if (
			(modalityEditable.requires_pre_master_exam &&
				!modalityEditable.pre_master_min_grade) ||
			modalityEditable.pre_master_min_grade < 0 ||
			modalityEditable.pre_master_min_grade > 20
		) {
			newErrors.pre_master_min_grade = 'Debe estar entre 0 y 20';
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
			postgraduate_type: Number(modalityEditable?.postgraduate_type?.value) || null,
			requires_pre_master_exam: modalityEditable.requires_pre_master_exam,
			pre_master_min_grade: modalityEditable.pre_master_min_grade,
			requires_essay: modalityEditable.requires_essay,
			requires_interview: modalityEditable.requires_interview,
		};

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

	const handleChange = (field, value) => {
		const boolValue = value === 'true';

		let updatedRequest = { ...modalityEditable, [field]: boolValue };

		if (field === 'requires_pre_master_exam' && boolValue) {
			// Desactiva ensayo e entrevista
			updatedRequest.requires_essay = false;
			updatedRequest.requires_interview = false;
		}
		if (
			(field === 'requires_essay' || field === 'requires_interview') &&
			boolValue
		) {
			// Desactiva pre-maestría
			updatedRequest.requires_pre_master_exam = false;
			updatedRequest.pre_master_min_grade = '';
		}

		setModalityEditable(updatedRequest);
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

				<Field
					label='¿Para qué tipo de programa es?'
					errorText={errors.type}
					invalid={!!errors.type}
					required
				>
					<ReactSelect
						value={modalityEditable.postgraduate_type}
						onChange={(select) => {
							setModalityEditable({
								...modalityEditable,
								postgraduate_type: select,
							});
						}}
						variant='flushed'
						size='xs'
						isDisabled={loadingProgramTypes}
						isLoading={loadingProgramTypes}
						isSearchable={true}
						isClearable
						name='Tipos de programa'
						options={programTypesOptions}
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
									handleChange('requires_pre_master_exam', e.target.value)
								}
							>
								<Flex gap={5}>
									<Radio value='true'>Sí</Radio>
									<Radio value='false'>No</Radio>
								</Flex>
							</RadioGroup>
						</Flex>
					</Field>
					{modalityEditable.requires_pre_master_exam && (
						<Field
							label='Nota mínima de pre-maestría (0 a 20)'
							invalid={!!errors.pre_master_min_grade}
							errorText={errors.pre_master_min_grade}
						>
							<Input
								type='number'
								value={modalityEditable.pre_master_min_grade}
								onChange={(e) =>
									setModalityEditable((prev) => ({
										...prev,
										pre_master_min_grade: e.target.value,
									}))
								}
								min={0}
								max={20}
								step={0.1}
								placeholder='Ej: 15.5'
							/>
						</Field>
					)}
				</Flex>

				<Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
					<Field label='Requiere ensayo'>
						<RadioGroup
							value={modalityEditable.requires_essay ? 'true' : 'false'}
							onChange={(e) => handleChange('requires_essay', e.target.value)}
						>
							<Flex gap={5}>
								<Radio value='true'>Sí</Radio>
								<Radio value='false'>No</Radio>
							</Flex>
						</RadioGroup>
					</Field>
					<Field label='Requiere entrevista personal'>
						<RadioGroup
							value={modalityEditable.requires_interview ? 'true' : 'false'}
							onChange={(e) =>
								handleChange('requires_interview', e.target.value)
							}
						>
							<Flex gap={5}>
								<Radio value='true'>Sí</Radio>
								<Radio value='false'>No</Radio>
							</Flex>
						</RadioGroup>
					</Field>
				</Flex>
			</Stack>
		</Modal>
	);
};

EditModality.propTypes = {
	fetchData: PropTypes.func,
	item: PropTypes.object,
};
