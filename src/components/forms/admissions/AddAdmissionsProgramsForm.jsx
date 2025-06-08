import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, Input, SimpleGrid, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';
import { useReadPrograms } from '@/hooks';
import { useCreateAdmissionsPrograms } from '@/hooks/admissions_programs';

export const AddAdmissionsProgramsForm = ({ id, fetchData }) => {
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

	const { mutate: createAdmissionsPrograms, isPending } =
		useCreateAdmissionsPrograms();
	const { data: dataPrograms } = useReadPrograms();

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
				console.error(error);
				toaster.create({
					title: error.response?.data?.[0] || 'Error al registrar el Programa',
					type: 'error',
				});
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
						options={dataMode}
					/>
				</Field>
				<Field label='Inicio de semestre:'>
					<Input
						value={semesterStart}
						onChange={(e) => setSemesterStart(e.target.value)}
						type='date'
						size='xs'
					/>
				</Field>

				<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
					<Field label='Inicio de inscripción:'>
						<Input
							value={registrationStart}
							onChange={(e) => setRegistrationStart(e.target.value)}
							type='date'
							size='xs'
						/>
					</Field>

					<Field label='Fin de inscripción:'>
						<Input
							value={registrationEnd}
							onChange={(e) => setRegistrationEnd(e.target.value)}
							type='date'
							size='xs'
						/>
					</Field>

					<Field label='Inicio de examen:'>
						<Input
							value={examStart}
							onChange={(e) => setExamStart(e.target.value)}
							type='date'
							size='xs'
						/>
					</Field>

					<Field label='Fin de examen:'>
						<Input
							value={examEnd}
							onChange={(e) => setExamEnd(e.target.value)}
							type='date'
							size='xs'
						/>
					</Field>

					<Field label='Inicio Pre-Maestría:'>
						<Input
							value={preMasterStart}
							onChange={(e) => setPreMasterStart(e.target.value)}
							type='date'
							size='xs'
						/>
					</Field>

					<Field label='Fin Pre-Maestría:'>
						<Input
							value={preMasterEnd}
							onChange={(e) => setPreMasterEnd(e.target.value)}
							type='date'
							size='xs'
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
};
