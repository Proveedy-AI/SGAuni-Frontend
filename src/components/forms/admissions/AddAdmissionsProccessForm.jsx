import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { useCreateAdmissions } from '@/hooks/admissions_proccess';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';

export const AddAdmissionsProccessForm = ({ fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [errors, setErrors] = useState({});
	const { mutate: createAdmissions, isPending } = useCreateAdmissions();

	const handleDateChange = (field) => (date) => {
		const formatted = format(date, 'yyyy-MM-dd');
		if (field === 'start') {
			setStartDate(formatted);
		} else if (field === 'end') {
			setEndDate(formatted);
		}
	};

	const validateFields = () => {
		const newErrors = {};
		if (!name) newErrors.name = 'El ciclo es requerido';
		if (!startDate) newErrors.startDate = 'La fecha de inicio es requerida';
		if (!endDate) newErrors.endDate = 'La fecha de fin es requerida';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = (e) => {
		e.preventDefault();

		// Validación de campos vacíos
		if (!validateFields()) return;

		const payload = {
			admission_process_name: name.trim(),
			start_date: startDate,
			end_date: endDate,
			editable: true,
		};

		createAdmissions(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Proceso registrado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setName('');
				setEndDate();
				setStartDate('');
			},
			onError: (error) => {
				console.log(error);
				toaster.create({
					title: 'Error al registrar el Proceso',
					description: error.response?.data?.admission_process_name[0] || 'Ocurrio un error en el servidor',
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Agregar Proceso de Admisión'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar Proceso
				</Button>
			}
			onSave={handleSubmitData}
			size='2xl'
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				<Field label='Ciclo:' invalid={!!errors.name} errorText={errors.name}>
					<Input
						value={name}
						onChange={(e) => {
							const newName = e.target.value;
							setName(newName);

							// Validación directa
							if (!/^\d{4}-(1|2)$/.test(newName)) {
								setErrors((prev) => ({
									...prev,
									name: 'Formato inválido. Ej: 2025-1 o 2025-2',
								}));
							} else {
								setErrors((prev) => ({ ...prev, name: undefined }));
							}
						}}
						placeholder='2025-1'
						size='xs'
					/>
				</Field>
				<Field
					label='Fecha Inicio'
					invalid={!!errors.startDate}
					errorText={errors.startDate}
				>
					<CustomDatePicker
						selectedDate={startDate}
						onDateChange={handleDateChange('start')}
						placeholder='Selecciona una fecha'
						size={{ base: '330px', md: '625px' }}
						buttonSize='sm'
						minDate={new Date()}
					/>
				</Field>

				<Field
					label='Fecha Fin:'
					invalid={!!errors.endDate}
					errorText={errors.endDate}
				>
					<CustomDatePicker
						selectedDate={endDate}
						onDateChange={handleDateChange('end')}
						placeholder='Selecciona una fecha'
						size={{ base: '330px', md: '625px' }}
						buttonSize='sm'
						minDate={new Date()}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddAdmissionsProccessForm.propTypes = {
	fetchData: PropTypes.func,
};
