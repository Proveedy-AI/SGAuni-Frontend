import { Field, Button, toaster, Modal } from '@/components/ui';
import { Input, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCreateProgramType } from '@/hooks';
import PropTypes from 'prop-types';

export const AddProgramType = ({ fetchData }) => {
	const { mutate: register, isPending: loading } = useCreateProgramType();

	const [open, setOpen] = useState(false);
	const [errors, setErrors] = useState({});
	const [programType, setProgramType] = useState({
		name: '',
		code: '',
		min_grade: '',
	});
	const contentRef = useRef();

	const validateFields = () => {
		const newErrors = {};
		if (!programType.name.trim()) newErrors.name = 'El nombre es requerido';
		if (!programType.code.trim()) newErrors.code = 'El código es requerido';
		if (!programType.min_grade) {
			newErrors.min_grade = 'La nota mínima es requerida';
		} else if (programType.min_grade < 0 || programType.min_grade > 20) {
			newErrors.min_grade = 'La nota mínima debe estar entre 0 y 20';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = async (e) => {
		e.preventDefault();
		if (!validateFields()) return;

		const payload = {
			name: programType.name,
			code: programType.code,
			min_grade: programType.min_grade,
		};

		register(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Tipo de programa creado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setProgramType({
					name: '',
					code: '',
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
			title='Crear Tipo de Programa'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Crear Tipo de Programa
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
					label='Nombre del Tipo de Programa'
					errorText={errors.name}
					invalid={!!errors.name}
					required
				>
					<Input
						required
						type='text'
						name='name'
						placeholder='Nombre del tipo de programa'
						value={programType.name}
						onChange={(e) =>
							setProgramType({ ...programType, name: e.target.value })
						}
					/>
				</Field>
				<Field
					label='Código del Tipo de Programa'
					errorText={errors.code}
					invalid={!!errors.code}
					required
				>
					<Input
						required
						type='text'
						name='code'
						placeholder='Código del tipo de programa'
						value={programType.code}
						onChange={(e) =>
							setProgramType({ ...programType, code: e.target.value })
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
						required
						type='number'
						name='min_grade'
						step='0.01'
						placeholder='Nota mínima'
						maxvalue={20}
						value={programType.min_grade}
						onChange={(e) => {
							const value = e.target.value;
							// Limita a 2 decimales
							const formatted = value.includes('.')
								? value.split('.')[0] + '.' + value.split('.')[1].slice(0, 2)
								: value;
							setProgramType({ ...programType, min_grade: formatted });
						}}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddProgramType.propTypes = {
	fetchData: PropTypes.func,
};
