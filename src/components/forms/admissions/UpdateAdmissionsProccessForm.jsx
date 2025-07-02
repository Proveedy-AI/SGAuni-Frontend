import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { useUpdateAdmissions } from '@/hooks/admissions_proccess';
import { ReactSelect } from '@/components/select';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';

export const UpdateAdmissionsProccessForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(data?.admission_process_name);
	const [startDate, setStartDate] = useState(data?.start_date);
	const [endDate, setEndDate] = useState(data?.end_date);
	const [selectedLevel, setSelectedLevel] = useState(null);
	const [errors, setErrors] = useState({});
	const validateFields = () => {
		const newErrors = {};
		if (!name.trim()) newErrors.name = 'El ciclo es requerido';
		if (!selectedLevel) newErrors.selectedLevel = 'Seleccione un nivel';
		if (!startDate) newErrors.startDate = 'La fecha de inicio es requerida';
		if (!endDate) newErrors.endDate = 'La fecha de fin es requerida';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleDateChange = (field) => (date) => {
		const formatted = format(date, 'yyyy-MM-dd');

		if (field === 'start') {
			setStartDate(formatted);
		} else if (field === 'end') {
			setEndDate(formatted);
		}
	};

	const { mutate: UpdateAdmissions, isPending } = useUpdateAdmissions();

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

		UpdateAdmissions(
			{ id: data.id, payload },
			{
				onSuccess: () => {
					toaster.create({
						title: 'Proceso actualizado correctamente',
						type: 'success',
					});
					setOpen(false);
					fetchData();
				},
				onError: (error) => {
					console.log(error);
					toaster.create({
						title:
							error.response?.data?.[0] || 'Error al actualizar el Proceso',
						type: 'error',
					});
				},
			}
		);
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

	useEffect(() => {
		if (data && data.admission_level) {
			const matchedLevel = dataLevel.find(
				(level) => level.value === data.admission_level
			);
			if (matchedLevel) {
				setSelectedLevel({
					label: matchedLevel.label,
					value: matchedLevel.value,
				});
			}
		}
	}, [data]);

	return (
		<Modal
			title='Editar Proceso de Admisión'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Editar'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='cyan'
							css={{
								_icon: {
									width: '5',
									height: '5',
								},
							}}
						>
							<FiEdit2 />
						</IconButton>
					</Tooltip>
				</Box>
			}
			onSave={handleSubmitData}
			size='2xl'
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				<Field invalid={!!errors.name} errorText={errors.name} label='Ciclo:'>
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
					invalid={!!errors.selectedLevel}
					errorText={errors.selectedLevel}
					label='Nivel:'
				>
					<ReactSelect
						value={selectedLevel}
						onChange={(select) => {
							setSelectedLevel(select);
						}}
						variant='flushed'
						size='xs'
						isSearchable={true}
						isClearable
						name='paises'
						options={LevelOptions}
					/>
				</Field>
				<Field
					invalid={!!errors.startDate}
					errorText={errors.startDate}
					label='Fecha Inicio'
				>
					<Box w={'full'}>
						<CustomDatePicker
							selectedDate={startDate}
							onDateChange={handleDateChange('start')}
							placeholder='Selecciona una fecha'
							size={{ base: '330px', md: '470px' }}
						/>
					</Box>
				</Field>

				<Field
					invalid={!!errors.endDate}
					errorText={errors.endDate}
					label='Fecha Fin:'
				>
					<Box w={'full'}>
						<CustomDatePicker
							selectedDate={endDate}
							onDateChange={handleDateChange('end')}
							placeholder='Selecciona una fecha'
							size={{ base: '330px', md: '470px' }}
						/>
					</Box>
				</Field>
			</Stack>
		</Modal>
	);
};

UpdateAdmissionsProccessForm.propTypes = {
	fetchData: PropTypes.func,
	data: PropTypes.object,
};
