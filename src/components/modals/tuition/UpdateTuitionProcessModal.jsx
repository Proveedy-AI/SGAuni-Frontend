import { Field, Modal, toaster } from '@/components/ui';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import {
	FieldErrorText,
	Heading,
	Input,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import {
	useCreateEnrollments,
	useUpdateEnrollments,
	useDuplicateEnrollments,
} from '@/hooks/enrollments_proccess';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

export const UpdateTuitionProcessModal = ({
	open,
	onClose,
	data,
	fetchData,
	actionType,
	existingNames = [],
}) => {
	const { mutate: createEnrollments, isPending: isCreating } =
		useCreateEnrollments();
	const { mutate: updateEnrollments, isPending: isUpdating } =
		useUpdateEnrollments();
	const { mutate: duplicateEnrollments, isPending: isDuplicating } =
		useDuplicateEnrollments();

	const [toasterShown, setToasterShown] = useState(false);
	const [touched, setTouched] = useState({ academicPeriod: false });
	const [formData, setFormData] = useState({
		academicPeriod: '',
		startDate: '',
		endDate: '',
		evalStart: '',
		evalEnd: '',
		semesterStart: '',
	});

	const academicPeriodRegex = /^\d{4}-\d{1}$/;
	const isAcademicPeriodValid = academicPeriodRegex.test(
		formData.academicPeriod.trim()
	);

	const isDuplicatedValid = data
		? formData.academicPeriod.toLowerCase().includes(' - copia')
		: true;

	useEffect(() => {
		if (open) {
			if (data) {
				const baseAcademicPeriod = data.academic_period_name || '';
				setFormData({
					academicPeriod:
						actionType === 'duplicate'
							? baseAcademicPeriod.trim() + ' - Copia'
							: baseAcademicPeriod,
					startDate: data.start_date || '',
					endDate: data.end_date || '',
				});
			} else {
				setFormData({
					academicPeriod: '',
					startDate: '',
					endDate: '',
				});
			}

			setTouched({
				academicPeriod: false,
			});
		}
	}, [open, data, actionType]);

	const handleChange = (key, value) => {
		const formatted =
			value instanceof Date ? format(value, 'yyyy-MM-dd') : value;

		setFormData((prev) => ({
			...prev,
			[key]: formatted,
		}));

		setTouched((prev) => ({
			...prev,
			[key]: true,
		}));
	};

	const handleSave = () => {
		if (toasterShown) return;
		setToasterShown(true);

		const normalizedName = formData.academicPeriod.trim().toLowerCase();

		if (actionType === 'duplicate') {
			const payload = {
				academic_period_name: formData.academicPeriod,
				start_date: formData.startDate,
				end_date: formData.endDate,
				elective_period: data.elective_period
			};

			if (existingNames.includes(normalizedName)) {
				toaster.create({
					title: 'Ya existe un periodo con este nombre',
					type: 'error',
					onStatusChange({ status }) {
						if (status === 'unmounted') setToasterShown(false);
					},
				});
				setToasterShown(true);
				return;
			}

			duplicateEnrollments(
				{ id: data.id, payload },
				{
					onSuccess: () => {
						toaster.create({
							title: 'Periodo duplicado correctamente',
							type: 'success',
							onStatusChange({ status }) {
								if (status === 'unmounted') setToasterShown(false);
							},
						});
						setToasterShown(true);
						fetchData();
						onClose();
					},
					onError: (error) => {
						toaster.create({
							title: error.message || 'Error al duplicar el Periodo',
							type: 'error',
							onStatusChange({ status }) {
								if (status === 'unmounted') setToasterShown(false);
							},
						});
						setToasterShown(true);
					},
				}
			);
		} else if (actionType === 'create') {
			const payload = {
				academic_period_name: formData.academicPeriod,
				start_date: formData.startDate,
				end_date: formData.endDate,
			};

			if (existingNames.includes(normalizedName)) {
				toaster.create({
					title: 'Ya existe un periodo con este nombre',
					type: 'error',
					onStatusChange({ status }) {
						if (status === 'unmounted') setToasterShown(false);
					},
				});
				setToasterShown(true);
				return;
			}

			createEnrollments(payload, {
				onSuccess: () => {
					toaster.create({
						title: 'Proceso registrado correctamente',
						type: 'success',
						onStatusChange({ status }) {
							if (status === 'unmounted') setToasterShown(false);
						},
					});
					setToasterShown(true);
					fetchData();
					onClose();
				},
				onError: (error) => {
					console.log(error);
					toaster.create({
						title: error.message || 'Error al registrar el Proceso',
						type: 'error',
						onStatusChange({ status }) {
							if (status === 'unmounted') setToasterShown(false);
						},
					});
					setToasterShown(true);
				},
			});
		} else if (actionType === 'edit') {
			const payload = {
				academic_period_name: formData.academicPeriod,
				start_date: formData.startDate,
				end_date: formData.endDate,
				elective_period: data.elective_period,
			};

			const existingOtherNames = existingNames.filter(
				(name) => name !== data.academic_period_name?.toLowerCase()
			);

			if (existingOtherNames.includes(normalizedName)) {
				toaster.create({
					title: 'Ya existe otro periodo con este nombre',
					type: 'error',
					onStatusChange({ status }) {
						if (status === 'unmounted') setToasterShown(false);
					},
				});
				setToasterShown(true);
				return;
			}

			updateEnrollments(
				{ id: data.id, payload },
				{
					onSuccess: () => {
						toaster.create({
							title: 'Proceso actualizado correctamente',
							type: 'success',
							onStatusChange({ status }) {
								if (status === 'unmounted') setToasterShown(false);
							},
						});
						setToasterShown(true);
						fetchData();
						onClose();
					},
					onError: (error) => {
						toaster.create({
							title: error.message || 'Error al actualizar el Proceso',
							type: 'error',
							onStatusChange({ status }) {
								if (status === 'unmounted') setToasterShown(false);
							},
						});
						setToasterShown(true);
					},
				}
			);
		}
	};

	return (
		<Modal
			scrollBehavior='inside'
			title={
				actionType === 'edit'
					? 'Editar Período Académico'
					: actionType === 'duplicate'
						? 'Duplicar Período Académico'
						: 'Crear Período Académico'
			}
			placement='center'
			size='md'
			open={open}
			onOpenChange={(e) => {
				if (!e.open) onClose();
			}}
			onSave={handleSave}
			loading={isCreating || isUpdating || isDuplicating}
			disabledSave={ isCreating || isUpdating || isDuplicating || toasterShown}
			positionerProps={{ style: { padding: '0 40px' } }}
		>
			<Stack gap={4}>
				<Stack>
					<Field
						label='Nombre del Período Académico'
						invalid={
							(actionType === 'duplicate' && !isDuplicatedValid) ||
							(touched.academicPeriod && !isAcademicPeriodValid)
						}
					>
						<Input
							type='text'
							value={formData.academicPeriod}
							onChange={(e) => handleChange('academicPeriod', e.target.value)}
							css={{ '--focus-color': '#000' }}
							rounded='md'
							placeholder='2025-1'
						/>
						{touched.academicPeriod && !isAcademicPeriodValid && (
							<FieldErrorText>Formato inválido. Ej: 2025-1.</FieldErrorText>
						)}
						{actionType === 'duplicate' &&
							!formData.academicPeriod.toLowerCase().includes(' - copia') && (
								<FieldErrorText>
									El nombre del período debe incluir &quot; - Copia&quot;
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
								minDate={new Date()}
								size='100%'
							/>
						</Field>
						<Field label='Fecha de fin'>
							<CustomDatePicker
								selectedDate={formData.endDate}
								onDateChange={(date) => handleChange('endDate', date)}
								buttonSize='md'
								minDate={new Date()}
								size='150px'
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
				</Stack> */}
			</Stack>
		</Modal>
	);
};

UpdateTuitionProcessModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	data: PropTypes.object,
	fetchData: PropTypes.func,
	actionType: PropTypes.oneOf(['create', 'edit', 'duplicate']),
	existingNames: PropTypes.arrayOf(PropTypes.string),
};
