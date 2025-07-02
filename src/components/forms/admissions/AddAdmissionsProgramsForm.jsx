import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, SimpleGrid, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';
import { useReadPrograms } from '@/hooks';
import { useCreateAdmissionsPrograms } from '@/hooks/admissions_programs';
import { useReadUsers } from '@/hooks/users';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';

export const AddAdmissionsProgramsForm = ({ id, profileId, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [registrationStart, setRegistrationStart] = useState('');
	const [registrationEnd, setRegistrationEnd] = useState('');
	const [examStart, setExamStart] = useState('');
	const [examEnd, setExamEnd] = useState('');
	const [semesterStart, setSemesterStart] = useState('');
	const [preMasterStart, setPreMasterStart] = useState('');
	const [preMasterEnd, setPreMasterEnd] = useState('');

	const [selectedMode, setSelectedMode] = useState(null);
	const [selectedType, setSelectedType] = useState(null);
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const [errors, setErrors] = useState({});
	const { mutate: createAdmissionsPrograms, isPending } =
		useCreateAdmissionsPrograms();
	const { data: dataPrograms } = useReadPrograms(
		{ coordinator_id: profileId },
		{ enabled: open }
	);
	const { data: dataUsers, isLoading } = useReadUsers({}, { enabled: open });

	const validateFields = () => {
		const newErrors = {};
		if (!name.trim()) newErrors.name = 'El ciclo es requerido';
		if (!selectedType)
			newErrors.selectedType = 'Seleccione un tipo de postgrado';
		if (!selectedMode) newErrors.selectedMode = 'Seleccione un modo de estudio';
		if (!selectedProgram) newErrors.selectedProgram = 'Seleccione un programa';
		if (!selectedUser) newErrors.selectedUser = 'Seleccione un director';
		if (!registrationStart)
			newErrors.registrationStart =
				'Fecha de inicio de inscripción es requerida';
		if (!registrationEnd)
			newErrors.registrationEnd = 'Fecha de fin de inscripción es requerida';
		if (!examStart)
			newErrors.examStart = 'Fecha de inicio de examen es requerida';
		if (!examEnd) newErrors.examEnd = 'Fecha de fin de examen es requerida';
		if (!semesterStart)
			newErrors.semesterStart = 'Fecha de inicio de semestre es requerida';
		if (!preMasterStart)
			newErrors.preMasterStart = 'Fecha de inicio de pre-maestría es requerida';
		if (!preMasterEnd)
			newErrors.preMasterEnd = 'Fecha de fin de pre-maestría es requerida';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = (e) => {
		e.preventDefault();

		if (!validateFields()) return;

		const payload = {
			postgrad_type: selectedType.value,
			study_mode: selectedMode.value,
			admission_process: id,
			program: selectedProgram.value,
			director: selectedUser.value,
			registration_start_date: registrationStart,
			registration_end_date: registrationEnd,
			exam_date_start: examStart,
			exam_date_end: examEnd,
			semester_start_date: semesterStart,
			pre_master_start_date: preMasterStart,
			pre_master_end_date: preMasterEnd,
			editable: true,
		};

		createAdmissionsPrograms(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Programa guardado con éxito',
					description:
						'Recuerde enviar el programa para su revisión y validación correspondiente.',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setSelectedMode(null);
				setSelectedType(null);
				setSelectedProgram(null);
				setRegistrationStart('');
				setRegistrationEnd('');
				setExamStart('');
				setExamEnd('');
				setSemesterStart('');
				setPreMasterStart('');
				setPreMasterEnd('');
			},
			onError: (error) => {
				const errorData = error.response?.data;

				if (errorData && typeof errorData === 'object') {
					Object.values(errorData).forEach((errorList) => {
						if (Array.isArray(errorList)) {
							errorList.forEach((message) => {
								toaster.create({
									title: message,
									type: 'error',
								});
							});
						}
					});
				} else {
					toaster.create({
						title: 'Error al registrar el Programa',
						type: 'error',
					});
				}
			},
		});
	};

	const dataMode = [
		{ label: 'Virtual', value: 1 },
		{ label: 'Semi-Presencial', value: 2 },
		{ label: 'Presencial', value: 3 },
	];

	const dataType = [
		{ label: 'Investigación', value: 1 },
		{ label: 'Profesionalizante', value: 2 },
	];

	const ProgramsOptions = dataPrograms?.results?.map((department) => ({
		label: department.name,
		value: department.id,
	}));

	const UserstOptions = dataUsers?.results
		.filter((user) => user.roles?.some((role) => role.name === 'Director'))
		.map((user) => ({
			label: user.full_name,
			value: user.id,
		}));

	return (
		<Modal
			title='Agregar Programa de Admisión'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Añadir Programas
				</Button>
			}
			onSave={handleSubmitData}
			size='4xl'
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '140px' }}>
				<Field
					label='Programa:'
					invalid={!!errors.selectedProgram}
					errorText={errors.selectedProgram}
					required
				>
					<ReactSelect
						value={selectedProgram}
						onChange={setSelectedProgram}
						variant='flushed'
						size='xs'
						isSearchable
						isClearable
						options={ProgramsOptions}
					/>
				</Field>
				<Field
					label='Tipo de Postgrado:'
					invalid={!!errors.selectedType}
					errorText={errors.selectedType}
					required
				>
					<ReactSelect
						value={selectedType}
						onChange={setSelectedType}
						variant='flushed'
						size='xs'
						isClearable
						isSearchable
						options={dataType}
					/>
				</Field>

				<Field
					label='Modo de estudio:'
					invalid={!!errors.selectedMode}
					errorText={errors.selectedMode}
					required
				>
					<ReactSelect
						value={selectedMode}
						onChange={setSelectedMode}
						variant='flushed'
						isClearable
						size='xs'
						isSearchable
						options={dataMode}
					/>
				</Field>
				<Field
					label='Director:'
					invalid={!!errors.selectedUser}
					errorText={errors.selectedUser}
					required
				>
					<ReactSelect
						value={selectedUser}
						onChange={(select) => setSelectedUser(select)}
						variant='flushed'
						size='xs'
						isDisabled={isLoading}
						isLoading={isLoading}
						isClearable
						isSearchable={true}
						name='paises'
						options={UserstOptions}
					/>
				</Field>

				<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
					<Field
						label='Inicio de inscripción:'
						invalid={!!errors.registrationStart}
						errorText={errors.registrationStart}
						required
					>
						<CustomDatePicker
							selectedDate={registrationStart}
							onDateChange={(date) =>
								setRegistrationStart(format(date, 'yyyy-MM-dd'))
							}
							buttonSize='xs'
							size={{ base: '330px', md: '420px' }}
						/>
					</Field>

					<Field
						label='Fin de inscripción:'
						invalid={!!errors.registrationEnd}
						errorText={errors.registrationEnd}
						required
					>
						<CustomDatePicker
							selectedDate={registrationEnd}
							onDateChange={(date) =>
								setRegistrationEnd(format(date, 'yyyy-MM-dd'))
							}
							buttonSize='xs'
							size={{ base: '330px', md: '420px' }}
						/>
					</Field>

					<Field
						label='Inicio de examen:'
						invalid={!!errors.examStart}
						errorText={errors.examStart}
						required
					>
						<CustomDatePicker
							selectedDate={examStart}
							onDateChange={(date) => setExamStart(format(date, 'yyyy-MM-dd'))}
							buttonSize='xs'
							size={{ base: '330px', md: '420px' }}
						/>
					</Field>

					<Field
						label='Fin de examen:'
						invalid={!!errors.examEnd}
						errorText={errors.examEnd}
						required
					>
						<CustomDatePicker
							selectedDate={examEnd}
							onDateChange={(date) => setExamEnd(format(date, 'yyyy-MM-dd'))}
							buttonSize='xs'
							size={{ base: '330px', md: '420px' }}
						/>
					</Field>

					<Field
						label='Inicio Pre-Maestría:'
						invalid={!!errors.preMasterStart}
						errorText={errors.preMasterStart}
						required
					>
						<CustomDatePicker
							selectedDate={preMasterStart}
							onDateChange={(date) =>
								setPreMasterStart(format(date, 'yyyy-MM-dd'))
							}
							buttonSize='xs'
							size={{ base: '330px', md: '420px' }}
						/>
					</Field>

					<Field
						label='Fin Pre-Maestría:'
						invalid={!!errors.preMasterEnd}
						errorText={errors.preMasterEnd}
						required
					>
						<CustomDatePicker
							selectedDate={preMasterEnd}
							onDateChange={(date) =>
								setPreMasterEnd(format(date, 'yyyy-MM-dd'))
							}
							buttonSize='xs'
							size={{ base: '330px', md: '420px' }}
						/>
					</Field>
				</SimpleGrid>
				<Field
					label='Inicio de semestre:'
					invalid={!!errors.semesterStart}
					errorText={errors.semesterStart}
					required
				>
					<CustomDatePicker
						selectedDate={semesterStart}
						onDateChange={(date) => {
							const formatted = format(date, 'yyyy-MM-dd');
							setSemesterStart(formatted);
						}}
						buttonSize='xs'
						size={{ base: '330px', md: '850px' }}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddAdmissionsProgramsForm.propTypes = {
	fetchData: PropTypes.func.isRequired,
	id: PropTypes.string,
	profileId: PropTypes.number,
};
