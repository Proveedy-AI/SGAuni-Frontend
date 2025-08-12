import { ReactSelect } from '@/components';
import { StudentsTable } from '@/components/tables/students/StudentsTable';
import { Field } from '@/components/ui';
import { useReadAdmissionsPrograms } from '@/hooks/admissions_programs';

import { useReadStudents } from '@/hooks/students/useReadStudents';

import {
	Heading,
	InputGroup,
	Input,
	Flex,
	Card,
	Icon,
	Stack,
	Button,
	SimpleGrid,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FaUserGraduate } from 'react-icons/fa';
import { FiSearch, FiTrash } from 'react-icons/fi';
import { useDebounce } from 'use-debounce';

export const StudentsView = () => {
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [name, setName] = useState('');
	const [debouncedSearch] = useDebounce(name.trim(), 500); //
	const [scholarshipStatus, setScholarshipStatus] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState(null);

	const hasActiveFilters =
		selectedProgram ||
		name ||
		debouncedSearch ||
		scholarshipStatus ||
		selectedStatus;

	const clearFilters = () => {
		setSelectedProgram(null);
		setName('');
		setScholarshipStatus(null);
		setSelectedProgram(null);
		setSelectedStatus(null);
	};

	const filterParams = useMemo(() => {
		const params = {};
		if (selectedProgram) params.program = selectedProgram.value;
		if (debouncedSearch) params.name = debouncedSearch;
		if (scholarshipStatus) params.scholarship = scholarshipStatus.value;
		if (selectedStatus) params.status = selectedStatus.value;

		return params;
	}, [
		selectedProgram,
		debouncedSearch,
		scholarshipStatus,
		selectedStatus,
	]);

	const { data: dataPrograms, isLoading: isLoadingPrograms } =
		useReadAdmissionsPrograms({ status: 4 });

	const {
		data: dataStudents,
		fetchNextPage: fetchNextPageStudents,
		hasNextPage: hasNextPageStudents,
		isFetchingNextPage: isFetchingNextPageStudents,
		isLoading: loadingStudents,
		refetch: fetchStudents,
	} = useReadStudents({ filterParams }, {});

	const allStudents =
		dataStudents?.pages?.flatMap((page) => page.results) ?? [];

	const allPrograms =
		dataPrograms?.pages?.flatMap((page) => page.results) ?? [];

	const totalCount = dataStudents?.pages?.[0]?.count ?? 0;

	const ProgramsOptions =
		allPrograms?.map((program) => ({
			label: `${program.program_name} - ${program.admission_process_name}`,
			value: program.id,
		})) || [];

	const statusOptions = [
		{ id: 1, label: 'Activo', value: 1 },
		{ id: 2, label: 'Suspendido', value: 2 },
		{ id: 3, label: 'Graduado', value: 3 },
		{ id: 4, label: 'Retirado', value: 4 },
	];

	return (
		<Stack gap={4}>
			<Card.Root>
				<Card.Header>
					<Flex justify='space-between' align='center'>
						{/* Izquierda: ícono + título */}
						<Flex align='center' gap={2}>
							<Icon as={FaUserGraduate} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'>Estudiantes</Heading>
						</Flex>

						{/* Derecha */}
						<Stack direction='row' gap={2} align='center'>
							{hasActiveFilters && (
								<Button
									variant='outline'
									colorPalette='red'
									size='sm'
									onClick={clearFilters}
								>
									<FiTrash />
									Limpiar Filtros
								</Button>
							)}
						</Stack>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Stack gap={2} mb={2}>
						<SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 3 }} gap={2}>
							<Field label='Estudiante:'>
								<InputGroup flex='1' startElement={<FiSearch />}>
									<Input
										
										bg={'white'}
										size='sm'
										variant='outline'
										placeholder='Buscar por Estudiante'
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</InputGroup>
							</Field>
							<Field label='Periodo de Admisión:'>
								<ReactSelect
									placeholder='Seleccionar'
									value={selectedProgram}
									onChange={setSelectedProgram}
									isLoading={isLoadingPrograms}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={ProgramsOptions}
								/>
							</Field>

							<Field label='Beca otorgada:'>
								<ReactSelect
									placeholder='Seleccionar'
									value={scholarshipStatus}
									onChange={(option) => setScholarshipStatus(option)}
									variant='flushed'
									size='xs'
									isClearable
									options={[
										{ label: 'Sí', value: true },
										{ label: 'No', value: false },
									]}
								/>
							</Field>
							<Field label='Estado:'>
								<ReactSelect
									placeholder='Seleccionar'
									value={selectedStatus}
									onChange={setSelectedStatus}
									variant='flushed'
									size='xs'
									isSearchable
									isClearable
									options={statusOptions}
								/>
							</Field>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>

			<StudentsTable
				isLoading={loadingStudents}
				data={allStudents}
				fetchNextPage={fetchNextPageStudents}
				isFetchingNextPage={isFetchingNextPageStudents}
				hasNextPage={hasNextPageStudents}
				totalCount={totalCount}
				refetch={fetchStudents}
			/>
		</Stack>
	);
};
