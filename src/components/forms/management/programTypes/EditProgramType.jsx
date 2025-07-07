import { Field, Modal, toaster } from '@/components/ui';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useUpdateProgramType } from '@/hooks';
import { HiPencil } from 'react-icons/hi2';
import PropTypes from 'prop-types';

export const EditProgramType = ({ fetchData, item }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [errors, setErrors] = useState({});
	const { mutateAsync: update, isPending: loadingUpdate } =
		useUpdateProgramType();
	const [programRequest, setProgramRequest] = useState({
		name: item.name,
		code: item.code,
		min_grade: item.min_grade,
	});

	const validateFields = () => {
		const newErrors = {};
		if (!programRequest.name.trim()) newErrors.name = 'El nombre es requerido';
		if (!programRequest.code.trim()) newErrors.code = 'El código es requerido';
		if (!programRequest.min_grade) {
			newErrors.min_grade = 'La nota mínima es requerida';
		} else if (programRequest.min_grade < 0 || programRequest.min_grade > 20) {
			newErrors.min_grade = 'La nota mínima debe estar entre 0 y 20';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleUpdate = async () => {
		if (!validateFields()) return;

		const payload = {
			name: programRequest.name,
			code: programRequest.code,
			min_grade: programRequest.min_grade,
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
				<Field label='Nombre del tipo de programa' errorText={errors.name} invalid={!!errors.name} required>
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

				<Field label='Código del tipo de programa' errorText={errors.code} invalid={!!errors.code} required>
					<Input
						value={programRequest.code}
						onChange={(e) =>
							setProgramRequest({
								...programRequest,
								code: e.target.value,
							})
						}
					/>
				</Field>
        <Field
          label='Nota mínima aprobatoria (0 a 20)'
          errorText={errors.min_grade}
          invalid={!!errors.min_grade}
          required
        >
          <Input
            value={programRequest.min_grade}
            onChange={(e) =>
              setProgramRequest((prev) => ({
                ...prev,
                min_grade: e.target.value,
              }))
            }
          />
        </Field>
			</Stack>
		</Modal>
	);
};

EditProgramType.propTypes = {
	fetchData: PropTypes.func,
	item: PropTypes.object,
};
