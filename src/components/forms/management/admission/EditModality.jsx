import {
	ControlledModal,
	Field,
	toaster,
	Switch, // se cambio
} from '@/components/ui';
import { Flex, Input, Stack, Textarea } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useUpdateModality } from '@/hooks/modalities';
import PropTypes from 'prop-types';

export const EditModality = ({
	setMethods,
	selectedMethod,
	isEditModalOpen,
	setIsModalOpen,
	handleCloseModal,
}) => {
	const [modalityEditable, setModalityEditable] = useState(null); //se tratara de cambiar

	useEffect(() => {
		if (selectedMethod) {
			setModalityEditable(selectedMethod);
		}
	}, [selectedMethod]);

	const { mutateAsync: updateMethod, isLoading } = useUpdateModality();

	const handleEditMethod = async () => {
		if (!modalityEditable) return;

		const {
			name,
			description,
			requires_pre_master_exam,
			min_grade,
			requires_essay,
			essay_weight,
			requires_interview,
			interview_weight,
		} = modalityEditable;

		// Validación mínima
		if (!name || !description) {
			toaster.create({
				title: 'Completa los campos obligatorios',
				type: 'warning',
			});
			return;
		}

		const payload = {
			name,
			description,
			requires_pre_master_exam,
			min_grade: Number(min_grade),
			requires_essay,
			essay_weight: requires_essay ? Number(essay_weight) : null,
			requires_interview,
			interview_weight: requires_interview ? Number(interview_weight) : null,
		};

		await updateMethod(
			{ id: selectedMethod.id, payload },
			{
				onSuccess: () => {
					toaster.create({
						title: 'Modalidad actualizada correctamente',
						type: 'success',
					});
					handleCloseModal('edit');
					setMethods();
				},
				onError: (error) => {
					toaster.create({
						title: error.message || 'Error al actualizar la modalidad',
						type: 'error',
					});
				},
			}
		);
	};

	const handleRadioChange = (field, value) => {
		setModalityEditable((prev) => ({
			...prev,
			[field]: value, // Ya es booleano
		}));
	};

	return (
		<Stack css={{ '--field-label-width': '180px' }}>
			<Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
				<ControlledModal
					title='Editar Modalidad'
					placement='center'
					size='xl'
					open={isEditModalOpen}
					onOpenChange={(e) => setIsModalOpen((s) => ({ ...s, edit: e.open }))}
					onSave={handleEditMethod}
					loading={isLoading} // es loading
				>
					<Stack spacing={4}>
						<Field label='Nombre de la modalidad'>
							<Input
								value={modalityEditable?.name || ''}
								onChange={(e) =>
									setModalityEditable((prev) => ({
										...prev,
										name: e.target.value,
									}))
								}
							/>
						</Field>

						<Field label='Descripción'>
							<Textarea
								value={modalityEditable?.description || ''}
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
									<Switch
										checked={modalityEditable?.requires_pre_master_exam}
										onChange={(e) =>
											handleRadioChange(
												'requires_pre_master_exam',
												e.target.checked
											)
										}
										colorScheme='teal'
										borderRadius='full'
									/>
									{modalityEditable?.requires_pre_master_exam ? 'Sí' : 'No'}
								</Flex>
							</Field>

							<Field label='Grado mínimo'>
								<Input
									type='number'
									value={modalityEditable?.min_grade || ''}
									onChange={(e) =>
										setModalityEditable((prev) => ({
											...prev,
											min_grade: e.target.value,
										}))
									}
									placeholder='Ingrese el grado mínimo'
								/>
							</Field>
						</Flex>

						<Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
							<Field label='Requiere ensayo'>
								<Flex align='center' gap={3}>
									<Switch
										checked={modalityEditable?.requires_essay}
										onChange={(e) =>
											handleRadioChange('requires_essay', e.target.checked)
										}
										colorScheme='teal'
										borderRadius='full'
									/>
									{modalityEditable?.requires_essay ? 'Sí' : 'No'}
								</Flex>
							</Field>

							{modalityEditable?.requires_essay && (
								<Field label='Peso del ensayo (0 a 1)'>
									<Input
										type='number'
										value={modalityEditable?.essay_weight || ''}
										onChange={(e) =>
											setModalityEditable((prev) => ({
												...prev,
												essay_weight: e.target.value,
											}))
										}
										min={0}
										max={1}
										step={0.01}
										placeholder='Ej: 0.5'
									/>
								</Field>
							)}
						</Flex>

						<Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
							<Field label='Requiere entrevista personal'>
								<Flex align='center' gap={3}>
									<Switch
										checked={modalityEditable?.requires_interview}
										onChange={(e) =>
											handleRadioChange('requires_interview', e.target.checked)
										}
										colorScheme='teal'
										borderRadius='full'
									/>
									{modalityEditable?.requires_interview ? 'Sí' : 'No'}
								</Flex>
							</Field>

							{modalityEditable?.requires_interview && (
								<Field label='Peso de la entrevista (0 a 1)'>
									<Input
										type='number'
										value={modalityEditable?.interview_weight || ''}
										onChange={(e) =>
											setModalityEditable((prev) => ({
												...prev,
												interview_weight: e.target.value,
											}))
										}
										min={0}
										max={1}
										step={0.01}
										placeholder='Ej: 0.5'
									/>
								</Field>
							)}
						</Flex>
					</Stack>
				</ControlledModal>
			</Field>
		</Stack>
	);
};

EditModality.propTypes = {
	selectedMethod: PropTypes.object,
	isEditModalOpen: PropTypes.bool,
	setIsModalOpen: PropTypes.func,
	handleCloseModal: PropTypes.func,
	setMethods: PropTypes.func,
};
