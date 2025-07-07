import { Field, Button, toaster, Modal } from '@/components/ui';
import { Input, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useCreateProgramFocus } from '@/hooks/programs/programsFocus/useCreateProgramFocus';

export const AddProgramFocus = ({ fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [errors, setErrors] = useState({});
	const { mutate: register, isPending: loading } = useCreateProgramFocus();

	const [programRequest, setProgramRequest] = useState({
		name: '',
	});

	const validateFields = () => {
		const newErrors = {};
		if (!programRequest.name.trim()) newErrors.name = 'El nombre es requerido';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = async (e) => {
		e.preventDefault();

		if (!validateFields()) return;

		const payload = {
			name: programRequest.name,
		};

		register(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Enfoque creado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setProgramRequest({
					name: '',
				});
			},
			onError: (error) => {
				toaster.create({
					title: error.message,
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Crear Enfoque de Programa'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Crear Enfoque de Programa
				</Button>
			}
			onSave={handleSubmitData}
			loading={loading}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '120px' }}>
				<Field
					label='Nombre del Enfoque'
					invalid={!!errors.name}
					errorText={errors.name}
				>
					<Input
						required
						type='text'
						name='name'
						placeholder='Nombre del enfoque'
						value={programRequest.name}
						onChange={(e) =>
							setProgramRequest({ ...programRequest, name: e.target.value })
						}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddProgramFocus.propTypes = {
	fetchData: PropTypes.func,
	programTypesOptions: PropTypes.array,
	coordinatorsOptions: PropTypes.array,
	loadingProgramTypes: PropTypes.bool,
	loadingCoordinators: PropTypes.bool,
};
