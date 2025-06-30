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
	const [modalityEditable, setModalityEditable] = useState(item);

	const handleUpdate = async () => {
		// Compara si no hubo cambios
		if (JSON.stringify(modalityEditable) === JSON.stringify(item))
			return toaster.create({
				title: 'No se efectuaron cambios',
				type: 'info',
			});

		const payload = {
			name: modalityEditable.name,
			description: modalityEditable.description,
			requires_pre_master_exam: modalityEditable.requires_pre_master_exam,
			min_grade: modalityEditable.min_grade,
			requires_essay: modalityEditable.requires_essay,
			essay_weight: modalityEditable.essay_weight,
			requires_interview: modalityEditable.requires_interview,
			interview_weight: modalityEditable.interview_weight,
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
				<Field label='Nombre de la modalidad'>
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

				<Field label='Descripción'>
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

					<Field label='Nota mínima (0 a 20)'>
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
							onChange={(e) =>
								setModalityEditable((prev) => ({
									...prev,
									requires_essay: e.target.value === 'true',
								}))
							}
						>
							<Flex gap={5}>
								<Radio value={'true'}>Sí</Radio>
								<Radio value={'false'}>No</Radio>
							</Flex>
						</RadioGroup>
					</Field>

					{modalityEditable.requires_essay && (
						<Field label='Peso del ensayo (0 a 1)'>
							<Input
								required
								type='number'
								value={modalityEditable.essay_weight}
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
						<RadioGroup
							value={modalityEditable.requires_interview ? 'true' : 'false'}
							onChange={(e) =>
								setModalityEditable((prev) => ({
									...prev,
									requires_interview: e.target.value === 'true',
								}))
							}
						>
							<Flex gap={5}>
								<Radio value={'true'}>Sí</Radio>
								<Radio value={'false'}>No</Radio>
							</Flex>
						</RadioGroup>
					</Field>

					{modalityEditable.requires_interview && (
						<Field label='Peso de la entrevista (0 a 1)'>
							<Input
								type='number'
								value={modalityEditable.interview_weight}
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
		</Modal>
	);
};

EditModality.propTypes = {
	fetchData: PropTypes.func,
	item: PropTypes.object,
};
