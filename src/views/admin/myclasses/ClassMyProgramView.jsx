import { ReactSelect } from '@/components';
import { ClassMyProgramsTable } from '@/components/tables/myclasses';
import { Button, Field } from '@/components/ui';
import { useReadMyCourseGroups } from '@/hooks/course_groups';
import { useReadEnrollments } from '@/hooks/enrollments_proccess';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Card,
	Flex,
	Heading,
	Icon,
	Input,
	InputGroup,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiBookOpen, FiSearch, FiTrash } from 'react-icons/fi';

export const ClassMyProgramView = () => {
	const [selectedAcademicPeriod, setSelectedAcademicPeriod] = useState(null);
	const [selectedName, setSelectedName] = useState('');
	const [selectedStatus, setSelectedStatus] = useState(null);

	const hasActiveFilters = selectedName || selectedStatus;

	const clearFilters = () => {
		setSelectedName('');
		setSelectedStatus(null);
	};

	const { data: dataEnrollments, isLoading: loadingEnrollments } =
		useReadEnrollments();

	const { data: profile } = useReadUserLogged();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const StatusOptions = [
		{ value: 1, label: 'Por Empezar' },
		{ value: 2, label: 'En Curso' },
	];

	const { data: dataCourseGroups, isLoading: loadingCourseGroups } =
		useReadMyCourseGroups({}, {});

	const dateNow = new Date();
	const filteredProgramsWithCourses =
		dataCourseGroups?.programs?.filter((program) => {
			const semesterStartDate = new Date(program.semester_start_date);

			const matchesName =
				!selectedName ||
				program.program_name
					?.toLowerCase()
					.includes(selectedName.toLowerCase());

			const matchesStatus =
				!selectedStatus ||
				(selectedStatus.value === 1 && dateNow < semesterStartDate) || // Por Empezar
				(selectedStatus.value === 2 && semesterStartDate <= dateNow); // En Curso

			const matchesAcademicPeriod =
				!selectedAcademicPeriod || program.enrollment_period_name === selectedAcademicPeriod.label;

			return matchesName && matchesStatus && matchesAcademicPeriod;
		}) ?? [];

	const AcademicPeriodOptions = dataEnrollments?.results?.map((item) => ({
		value: item.id,
		label: item.academic_period_name,
	}));

	useEffect(() => {
		if (dataEnrollments) {
			setSelectedAcademicPeriod(AcademicPeriodOptions[0]);
		}
	}, [dataEnrollments]);

	return (
		<Stack gap={4}>
			<Card.Root>
				<Card.Header>
					<Flex justify='space-between' align='center'>
						<Flex align='center' gap={2}>
							<Icon as={FiBookOpen} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'>Programas</Heading>
						</Flex>

						<Stack direction='row' spacing={2} align='center'>
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
					<Stack gap={4} mb={4}>
						<SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 3 }} gap={6}>
							<Field label='Periodo Académico:'>
								<ReactSelect
									placeholder='Seleccionar'
									value={selectedAcademicPeriod}
									onChange={setSelectedAcademicPeriod}
									isLoading={loadingEnrollments}
									variant='flushed'
									size='xs'
									isSearchable
									options={AcademicPeriodOptions}
								/>
							</Field>
							<Field label='Programa Académico:'>
								<InputGroup flex='1' startElement={<FiSearch />}>
									<Input
										ml='1'
										size='sm'
										bg={'white'}
										maxWidth={'550px'}
										placeholder='Buscar por nombre de curso'
										value={selectedName}
										onChange={(e) => setSelectedName(e.target.value)}
									/>
								</InputGroup>
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
									options={StatusOptions}
								/>
							</Field>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>

			<ClassMyProgramsTable
				isLoading={loadingCourseGroups}
				data={filteredProgramsWithCourses}
				permissions={permissions}
			/>
		</Stack>
	);
};
