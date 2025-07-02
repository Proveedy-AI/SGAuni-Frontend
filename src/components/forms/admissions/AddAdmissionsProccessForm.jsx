import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { useCreateAdmissions } from '@/hooks/admissions_proccess';
import { ReactSelect } from '@/components/select';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';

export const AddAdmissionsProccessForm = ({ fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [selectedLevel, setSelectedLevel] = useState(null);
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
		if (!name.trim()) newErrors.name = 'El ciclo es requerido';
		if (!selectedLevel) newErrors.selectedLevel = 'Seleccione un nivel';
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
			admission_level: selectedLevel.value,
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
				setSelectedLevel(null);
				setEndDate();
				setStartDate('');
			},
			onError: (error) => {
				console.log(error);
				toaster.create({
					title: error.response?.data?.[0] || 'Error al registrar el Proceso',
					type: 'error',
				});
			},
		});
	};

	const dataLevel = [
		{ label: 'Maestría', value: 2 },
		{ label: 'Doctorado', value: 3 },
		{ label: 'Diplomado', value: 3 },
	];

	const LevelOptions = dataLevel.map((level) => ({
		label: level.label,
		value: level.value,
	}));

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
						}}
						placeholder='2025-I'
						size='xs'
					/>
				</Field>
				<Field
					label='Nivel:'
					invalid={!!errors.selectedLevel}
					errorText={errors.selectedLevel}
				>
					<ReactSelect
						value={selectedLevel}
						onChange={(select) => {
							setSelectedLevel(select);
						}}
						variant='flushed'
						size='xs'
						isSearchable
						isClearable
						name='paises'
						options={LevelOptions}
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
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddAdmissionsProccessForm.propTypes = {
	fetchData: PropTypes.func,
};
