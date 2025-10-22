import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import {
	Box,
	Heading,
	IconButton,
	Input,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

export const EditTuitionProcessModal = ({ data, permissions, fetchData }) => {
	const [open, setOpen] = useState(false);

	const [formData, setFormData] = useState({
		academicPeriod: '',
		startDate: '',
		endDate: '',
		// evalStart: '',
		// evalEnd: '',
		// semesterStart: '',
	});

	useEffect(() => {
		if (data && open) {
			setFormData({
				academicPeriod: data.academicPeriod || '',
				startDate: '2026-08-13',
				endDate: '2026-12-20',
				// evalStart: '2026-09-03',
				// evalEnd: '2026-12-20',
				// semesterStart: '2026-12-25',
			});
		}
	}, [open, data]);

	const handleChange = (key, value) => {
		const formatted = value instanceof Date ? format(value, 'yyyy-MM-dd') : value;
		setFormData((prev) => ({
			...prev,
			[key]: formatted,
		}));
	};

	const isValid = Object.values(formData).every((val) => val.trim() !== '');

	return (
		<Modal
			scrollBehavior='inside'
			title='Editar Período Académico'
			placement='center'
			size='md'
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			onSave={() => {
				toaster.create({
					title: 'Se modificaron los datos correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
			}}
			disabledSave={!isValid}
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
							colorPalette='green'
							disabled={!permissions?.includes('enrollments.proccessEnrollments.edit')}
						>
							<FiEdit2 />
						</IconButton>
					</Tooltip>
				</Box>
			}
			positionerProps={{ style: { padding: '0 40px' } }}
		>
			<Stack gap={4}>
				<Stack>
					<Field label='Nombre del Período Académico'>
						<Input
							type='text'
							value={formData.academicPeriod}
							onChange={(e) => handleChange('academicPeriod', e.target.value)}
							css={{ '--focus-color': '#000' }}
                            rounded="md"
						/>
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
                                size="100%"
							/>
						</Field>
						<Field label='Fecha de fin'>
							<CustomDatePicker
								selectedDate={formData.endDate}
								onDateChange={(date) => handleChange('endDate', date)}
                                buttonSize='md'
                                size="150px"
							/>
						</Field>
					</SimpleGrid>
				</Stack>

				{/* <Stack>
					<Heading size='md' color='uni.secondary'>
						Cronograma de evaluaciones
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						<Field label='Evaluación inicial'>
							<CustomDatePicker
								selectedDate={formData.evalStart}
								onDateChange={(date) => handleChange('evalStart', date)}
                                buttonSize='md'
                                size="150px"
							/>
						</Field>
						<Field label='Evaluación final'>
							<CustomDatePicker
								selectedDate={formData.evalEnd}
								onDateChange={(date) => handleChange('evalEnd', date)}
                                buttonSize='md'
                                size="150px"
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
                        size="150px"
					/>
				</Stack> */}
			</Stack>
		</Modal>
	);
};

EditTuitionProcessModal.propTypes = {
	data: PropTypes.object,
	permissions: PropTypes.array,
	fetchData: PropTypes.func,
};
