import { Field, Modal, toaster } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import {
	FieldErrorText,
	Heading,
	Input,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

export const AddTuitionProcessModal = ({ open, onClose, data }) => {
	const [formData, setFormData] = useState({
		academicPeriod: '',
		startDate: '',
		endDate: '',
		evalStart: '',
		evalEnd: '',
		semesterStart: '',
	});

	useEffect(() => {
		if (data && open) {
			setFormData({
				academicPeriod: data.academicPeriod || '',
				startDate: '2026-08-13',
				endDate: '2026-12-20',
				evalStart: '2026-09-03',
				evalEnd: '2026-12-20',
				semesterStart: '2026-12-25',
			});
		} else if (!data && open) {
			setFormData({
				academicPeriod: '',
				startDate: '',
				endDate: '',
				evalStart: '',
				evalEnd: '',
				semesterStart: '',
			});
		}
	}, [open, data]);

	const handleChange = (key, value) => {
		const formatted =
			value instanceof Date ? format(value, 'yyyy-MM-dd') : value;
		setFormData((prev) => ({
			...prev,
			[key]: formatted,
		}));
	};

	const isDuplicatedValid = data
		? formData.academicPeriod.trim().toLowerCase().includes('-copia')
		: true;

	const isValid = Object.values(formData).every((val) => val.trim() !== '') && isDuplicatedValid;

	const handleSave = () => {
		console.log('Datos guardados:', formData);
		toaster.create({
			title: data
				? 'Período duplicado correctamente'
				: 'Período creado correctamente',
			type: 'success',
		});
		onClose();
	};

	return (
		<Modal
			scrollBehavior='inside'
			title={data ? 'Duplicar Período Académico' : 'Crear Período Académico'}
			placement='center'
			size='md'
			open={open}
			onOpenChange={(e) => {
				if (!e.open) onClose();
			}}
			onSave={handleSave}
			disabledSave={!isValid}
			positionerProps={{ style: { padding: '0 40px' } }}
		>
			<Stack gap={4}>
				<Stack>
					<Field
						label='Nombre del Período Académico'
						invalid={!isDuplicatedValid}
					>
						<Input
							type='text'
							value={formData.academicPeriod}
							onChange={(e) => handleChange('academicPeriod', e.target.value)}
							css={{ '--focus-color': '#000' }}
							rounded='md'
						/>
						{data && !formData.academicPeriod.toLowerCase().includes('-copia') && (
							<FieldErrorText>
								El nombre del período debe incluir "-Copia".
							</FieldErrorText>
						)}
					</Field>
				</Stack>

				<Stack>
					<Heading size='md' color='uni.secondary'>
						Inscripción
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						<Field label='Fecha de inicio'>
							<CustomDatePicker
								selectedDate={formData.startDate}
								onDateChange={(date) => handleChange('startDate', date)}
								buttonSize='md'
								size='100%'
							/>
						</Field>
						<Field label='Fecha de fin'>
							<CustomDatePicker
								selectedDate={formData.endDate}
								onDateChange={(date) => handleChange('endDate', date)}
								buttonSize='md'
								size='150px'
							/>
						</Field>
					</SimpleGrid>
				</Stack>

				<Stack>
					<Heading size='md' color='uni.secondary'>
						Cronograma de evaluaciones
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						<Field label='Evaluación inicial'>
							<CustomDatePicker
								selectedDate={formData.evalStart}
								onDateChange={(date) => handleChange('evalStart', date)}
								buttonSize='md'
								size='150px'
							/>
						</Field>
						<Field label='Evaluación final'>
							<CustomDatePicker
								selectedDate={formData.evalEnd}
								onDateChange={(date) => handleChange('evalEnd', date)}
								buttonSize='md'
								size='150px'
							/>
						</Field>
					</SimpleGrid>
				</Stack>

				<Stack>
					<Heading size='md' color='uni.secondary'>
						Inicio de semestre
					</Heading>
					<CustomDatePicker
						selectedDate={formData.semesterStart}
						onDateChange={(date) => handleChange('semesterStart', date)}
						buttonSize='md'
						size='150px'
					/>
				</Stack>
			</Stack>
		</Modal>
	);
};

AddTuitionProcessModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	data: PropTypes.object,
};
