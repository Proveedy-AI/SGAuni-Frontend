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

	const { mutate: createAdmissionsPrograms, isPending } =
		useCreateAdmissionsPrograms();
	const { data: dataPrograms } = useReadPrograms(
		{ coordinator_id: profileId },
		{ enabled: open }
	);
	const { data: dataUsers, isLoading } = useReadUsers({}, { enabled: open });

	const handleSubmitData = (e) => {
		e.preventDefault();

		if (!selectedType || !selectedMode || !registrationStart) {
			toaster.create({
				title: 'Por favor completa todos los campos obligatorios',
				type: 'warning',
			});
			return;
		}

		const payload = {
			postgrad_type: selectedType.value,
			study_mode: selectedMode.value,
			admission_process: Number(id),
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
					title: 'Programa registrado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setSelectedMode(null);
				setSelectedType(null);
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
				<Field label='Programa:'>
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
				<Field label='Tipo de Postgrado:'>
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

				<Field label='Modo de estudio:'>
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
				<Field label='Director:'>
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
				<Field label='Inicio de semestre:'>
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

				<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
					<Field label='Inicio de inscripción:'>
						<CustomDatePicker
							selectedDate={registrationStart}
							onDateChange={(date) =>
								setRegistrationStart(format(date, 'yyyy-MM-dd'))
							}
							buttonSize='xs'
							size={{ base: '330px', md: '420px' }}
						/>
					</Field>

					<Field label='Fin de inscripción:'>
						<CustomDatePicker
							selectedDate={registrationEnd}
							onDateChange={(date) =>
								setRegistrationEnd(format(date, 'yyyy-MM-dd'))
							}
							buttonSize='xs'
							size={{ base: '330px', md: '420px' }}
						/>
					</Field>

					<Field label='Inicio de examen:'>
						<CustomDatePicker
							selectedDate={examStart}
							onDateChange={(date) => setExamStart(format(date, 'yyyy-MM-dd'))}
							buttonSize='xs'
							size={{ base: '330px', md: '420px' }}
						/>
					</Field>

					<Field label='Fin de examen:'>
						<CustomDatePicker
							selectedDate={examEnd}
							onDateChange={(date) => setExamEnd(format(date, 'yyyy-MM-dd'))}
							buttonSize='xs'
							size={{ base: '330px', md: '420px' }}
						/>
					</Field>

					<Field label='Inicio Pre-Maestría:'>
						<CustomDatePicker
							selectedDate={preMasterStart}
							onDateChange={(date) =>
								setPreMasterStart(format(date, 'yyyy-MM-dd'))
							}
							buttonSize='xs'
							size={{ base: '330px', md: '420px' }}
						/>
					</Field>

					<Field label='Fin Pre-Maestría:'>
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
			</Stack>
		</Modal>
	);
};

AddAdmissionsProgramsForm.propTypes = {
	fetchData: PropTypes.func.isRequired,
	id: PropTypes.string,
	profileId: PropTypes.number,
};
