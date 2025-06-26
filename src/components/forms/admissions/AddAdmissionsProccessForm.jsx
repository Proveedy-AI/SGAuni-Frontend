import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { useCreateAdmissions } from '@/hooks/admissions_proccess';
import { ReactSelect } from '@/components/select';
import { CustomDatePicker } from '@/components/ui/customDatepicker';
import { format } from 'date-fns';

export const AddAdmissionsProccessForm = ({ fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [selectedLevel, setSelectedLevel] = useState(null);
	console.log(startDate, endDate);
	const { mutate: createAdmissions, isPending } = useCreateAdmissions();

	const handleDateChange = (field) => (date) => {
		const formatted = format(date, 'yyyy-MM-dd');
		console.log(`Fecha ${field} para API:`, formatted);
		if (field === 'start') {
			setStartDate(formatted);
		} else if (field === 'end') {
			setEndDate(formatted);
		}
	};

	const handleSubmitData = (e) => {
		e.preventDefault();

		// Validación de campos vacíos
		if (!name.trim() || !startDate.trim()) {
			toaster.create({
				title: 'Por favor completa todos los campos',
				type: 'warning',
			});
			return;
		}

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
		{ label: 'Pre Maestría', value: 1 },
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
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Título:'
				>
					<Input
						value={name}
						onChange={(e) => {
							const newName = e.target.value;
							setName(newName);
						}}
						placeholder='Proceso 2025-II'
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Nivel:'
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
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Fecha Inicio'
				>
					<CustomDatePicker
						selectedDate={startDate}
						onDateChange={handleDateChange('start')}
						placeholder='Selecciona una fecha'
						size={{ base: '330px', md: '470px' }}
					/>
				</Field>

				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Fecha Fin:'
				>
					<CustomDatePicker
						selectedDate={endDate}
						onDateChange={handleDateChange('end')}
						placeholder='Selecciona una fecha'
						size={{ base: '330px', md: '470px' }}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddAdmissionsProccessForm.propTypes = {
	fetchData: PropTypes.func,
};
