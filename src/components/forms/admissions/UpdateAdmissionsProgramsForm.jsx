import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, SimpleGrid, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';
import { useReadPrograms } from '@/hooks';
import { useUpdateAdmissionsPrograms } from '@/hooks/admissions_programs';
import { useReadUsers } from '@/hooks/users';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';

export const UpdateAdmissionsProgramsForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [registrationStart, setRegistrationStart] = useState(
		data?.registration_start_date
	);
	const [registrationEnd, setRegistrationEnd] = useState(
		data?.registration_end_date
	);
	const [examStart, setExamStart] = useState(data?.exam_date_start);
	const [examEnd, setExamEnd] = useState(data?.exam_date_end);
	const [semesterStart, setSemesterStart] = useState(data?.semester_start_date);
	const [preMasterStart, setPreMasterStart] = useState(
		data?.pre_master_start_date
	);
	const [preMasterEnd, setPreMasterEnd] = useState(data?.pre_master_end_date);
	const [selectedMode, setSelectedMode] = useState(null);
	const [selectedType, setSelectedType] = useState(null);
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const { mutate: updateAdmissionsPrograms, isPending } =
		useUpdateAdmissionsPrograms();
	const { data: dataPrograms } = useReadPrograms({
		coordinator_id: data?.coordinator,
	});
	const { data: dataUsers, isLoading } = useReadUsers();

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
			admission_process: data.admission_process,
			program: selectedProgram.value,
			registration_start_date: registrationStart,
			registration_end_date: registrationEnd,
			exam_date_start: examStart,
			director: selectedUser.value,
			exam_date_end: examEnd,
			semester_start_date: semesterStart,
			pre_master_start_date: preMasterStart,
			pre_master_end_date: preMasterEnd,
			editable: true,
		};

		updateAdmissionsPrograms(
			{ id: data.id, payload },
			{
				onSuccess: () => {
					toaster.create({
						title: 'Programa actualizado correctamente',
						type: 'success',
					});
					setOpen(false);
					fetchData();
				},
				onError: (error) => {
					console.error(error);
					toaster.create({
						title:
							error.response?.data?.[0] || 'Error al Actualizar el Programa',
						type: 'error',
					});
				},
			}
		);
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

	useEffect(() => {
		if (data) {
			// Tipo de postgrado
			const matchedType = dataType.find(
				(type) => type.value === data.postgrad_type
			);
			if (matchedType) {
				setSelectedType(matchedType);
			}

			// Modo de estudio
			const matchedMode = dataMode.find(
				(mode) => mode.value === data.study_mode
			);
			if (matchedMode) {
				setSelectedMode(matchedMode);
			}

			// Programa (espera a que se carguen los programas)
			if (data.program && ProgramsOptions) {
				const matchedProgram = ProgramsOptions.find(
					(program) => program.value === data.program
				);
				if (matchedProgram) {
					setSelectedProgram(matchedProgram);
				}
			}
			if (data.director && UserstOptions) {
				const matchedDirector = UserstOptions.find(
					(director) => director.value === data.director
				);
				if (matchedDirector) {
					setSelectedUser(matchedDirector);
				}
			}
		}
	}, [data]);

	return (
		<Modal
			title='Editar Programa de Admisión'
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
							disabled={data.status === 4}
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
						isSearchable
						isClearable
						options={dataType}
					/>
				</Field>

				<Field label='Modo de estudio:'>
					<ReactSelect
						value={selectedMode}
						onChange={setSelectedMode}
						variant='flushed'
						size='xs'
						isSearchable
						isClearable
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
						isSearchable
						isClearable
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

UpdateAdmissionsProgramsForm.propTypes = {
	fetchData: PropTypes.func.isRequired,
	data: PropTypes.object,
};
