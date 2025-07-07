import { Field, Modal, toaster } from '@/components/ui';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { HiPencil } from 'react-icons/hi2';
import PropTypes from 'prop-types';
import { useUpdateProgramFocus } from '@/hooks/programs/programsFocus/useUpdateProgramFocus';

export const EditProgramFocus = ({ fetchData, item }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const { mutateAsync: update, isPending: loadingUpdate } =
		useUpdateProgramFocus();
	const [errors, setErrors] = useState({});
	const [programRequest, setProgramRequest] = useState({
		name: item.name,
	});

	const validateFields = () => {
		const newErrors = {};
		if (!programRequest.name.trim()) newErrors.name = 'El nombre es requerido';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleUpdate = async () => {
		if (!validateFields()) return;
		const payload = {
			name: programRequest.name,
		};

		await update(
			{ id: item.id, payload },
			{
				onSuccess: () => {
					toaster.create({
						title: 'Tipo de Programa actualizado correctamente',
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
			title='Editar Tipo de Programa'
			placement='center'
			trigger={
				<IconButton colorPalette='green' size='xs'>
					<HiPencil />
				</IconButton>
			}
			onSave={handleUpdate}
			loading={loadingUpdate}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack spacing={4}>
				<Field
					label='Nombre del enfoque'
					invalid={!!errors.name}
					errorMessage={errors.name}
					required
				>
					<Input
						value={programRequest.name}
						onChange={(e) =>
							setProgramRequest((prev) => ({
								...prev,
								name: e.target.value,
							}))
						}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

EditProgramFocus.propTypes = {
	fetchData: PropTypes.func,
	item: PropTypes.object,
};
