import PropTypes from 'prop-types';
import { ReactSelect } from '@/components';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import {
	GenerateStudentEnrolledListPdfModal,
	GenerateSuneduListPdfModal,
} from '@/components/modals/tuition/enrolled';
import { EnrolledCourseGroupsTable } from '@/components/tables/tuition/enrolled';
import {
	Button,
	InputGroup,
	Field,
	MenuRoot,
	MenuTrigger,
	MenuContent,
	MenuItem,
} from '@/components/ui';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { useReadEnrollmentById } from '@/hooks/enrollments_proccess';
import { useReadEnrollmentsPrograms } from '@/hooks/enrollments_programs';
import { useReadEnrollmentProgramCourses } from '@/hooks/enrollments_programs/courses';
import { useReadEnrollmentReport } from '@/hooks/enrollments_programs/reports';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Box,
	Card,
	Flex,
	Heading,
	Icon,
	Input,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiBookOpen, FiSearch, FiTrash } from 'react-icons/fi';
import { useParams } from 'react-router';

export const EnrolledCourseGroupsMenu = ({
	isDownloadable,
	dataEnrolledStudents,
	EnrollmentProgramOptions,
	UUIDEnrollmentProcess,
}) => {
	const [openDownloadEnrollmentModal, setOpenDownloadEnrollmentModal] =
		useState(false);
	const [openStudentsSuneduModal, setOpenStudentsSuneduModal] = useState(false);

	return (
		<Box>
			<MenuRoot>
				<MenuTrigger asChild>
					<Button
						size='sm'
						bg='white'
						color='black'
						border={'1px solid'}
						_hover={{ bg: 'gray.100' }}
					>
						Más Acciones
					</Button>
				</MenuTrigger>
				<MenuContent>
					<MenuItem
						_hover={{ bg: 'gray.100', color: 'uni.secondary' }}
						cursor={isDownloadable ? 'pointer' : 'not-allowed'}
						disabled={!isDownloadable}
						onClick={() => setOpenDownloadEnrollmentModal(true)}
					>
						Descargar matriculados
					</MenuItem>
					<MenuItem
						_hover={{ bg: 'gray.100', color: 'uni.secondary' }}
						cursor={isDownloadable ? 'pointer' : 'not-allowed'}
						disabled={!isDownloadable}
						onClick={() => setOpenStudentsSuneduModal(true)}
					>
						Descargar matriculados (SUNEDU)
					</MenuItem>
				</MenuContent>
			</MenuRoot>

			<GenerateStudentEnrolledListPdfModal
				open={openDownloadEnrollmentModal}
				setOpen={setOpenDownloadEnrollmentModal}
				students={dataEnrolledStudents}
				options={EnrollmentProgramOptions}
			/>

			<GenerateSuneduListPdfModal
				open={openStudentsSuneduModal}
				setOpen={setOpenStudentsSuneduModal}
				UUIDEnrollmentProcess={UUIDEnrollmentProcess}
			/>
		</Box>
	);
};

EnrolledCourseGroupsMenu.propTypes = {
	isDownloadable: PropTypes.bool,
	EnrollmentProgramOptions: PropTypes.array,
	dataEnrolledStudents: PropTypes.array,
	UUIDEnrollmentProcess: PropTypes.string,
};

export const EnrolledCourseGroupsView = () => {
	const { id } = useParams();
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);

  const { data: dataEnrollment, isLoading: isLoadingEnrollment } = useReadEnrollmentById(decrypted);

	const { data: profile } = useReadUserLogged();
	const roles = profile?.roles || [];
	const permissions = roles
		.flatMap((r) => r.permissions || [])
		.map((p) => p.guard_name);

	const {
		data: dataCourseGroups,
		fetchNextPage: fetchNextCourseGroups,
		hasNextPage: hasNextPageCourseGroups,
		isFetchingNextPage: isFetchingNextCourseGroups,
		refetch: fetchCourseGroups,
		isLoading,
	} = useReadEnrollmentProgramCourses({}, {});
  console.log(dataCourseGroups)

  let queryParams = {
    enrollment_period: decrypted
  };

  /*
  if (permiso) {
    queryParams['coordinator'] = 
  }
    if (permiso) {
    queryParams['director'] = 
  }
  */

	const {
		data: dataEnrollmentProgram,
		isLoading: isLoadingEnrollmentProgram, //<-- Para el ReactSelect
	} = useReadEnrollmentsPrograms( //<- no de todos
		{ enrollment_period: decrypted },
		{ enabled: !!decrypted }
	);

	const EnrollmentProgramOptions = dataEnrollmentProgram?.results?.map(
		(item) => ({
			value: item.id,
			label: item.program_name,
		})
	);

	const [searchName, setSearchName] = useState('');
	const [selectedProgram, setSelectedProgram] = useState(null);

	const allCourseGroups =
		dataCourseGroups?.pages?.flatMap((page) => page.results) ?? [];

		console.log(allCourseGroups)
	const filteredCourseGroupsByEnrollmentPeriod =
		allCourseGroups.filter((group) => group.enrollment_period === dataEnrollment?.academic_period_name) ??
		[];

	const filteredCourseGroups = filteredCourseGroupsByEnrollmentPeriod.filter(
		(group) =>
			(!searchName ||
				group.course
					.toLowerCase()
					.includes(searchName.toLowerCase())) &&
			(!selectedProgram || group.enrollment_program === selectedProgram?.value)
	);

	const hasActiveFilters = searchName || selectedProgram;

	const clearFilters = () => {
		setSearchName('');
		setSelectedProgram(null);
	};

	const { data: dataEnrollmentProcess, isLoading: isLoadingEnrollmentProcess } =
		useReadEnrollmentById(decrypted);

	const { data: dataEnrolledStudents, isLoading: isLoadingEnrolledStudents } =
		useReadEnrollmentReport({ enrollment_period_id: decrypted }, {});

	const totalCount = hasActiveFilters
		? filteredCourseGroups.length
		: (allCourseGroups?.length ?? 0);

	const isDownloadable =
		!isLoadingEnrolledStudents && dataEnrolledStudents.length > 0;

	return (
		<Box spaceY='5' p={{ base: 4, md: 6 }} maxW='8xl' mx='auto'>
			<ResponsiveBreadcrumb
				items={[
					{ label: 'Matriculados', to: '/enrollments/enrolled' },
					{
						label: !isLoadingEnrollmentProcess
							? dataEnrollmentProcess?.academic_period_name
							: 'Cargando...',
					},
				]}
			/>

			<Card.Root>
				<Card.Header>
					<Flex justify='space-between' align='center'>
						<Flex align='center' gap={2}>
							<Icon as={FiBookOpen} boxSize={5} color='blue.600' />
							<Heading fontSize='24px'>Grupos de Cursos</Heading>
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
							<EnrolledCourseGroupsMenu
								isDownloadable={isDownloadable}
								dataEnrolledStudents={dataEnrolledStudents}
								EnrollmentProgramOptions={EnrollmentProgramOptions}
								UUIDEnrollmentProcess={dataEnrollmentProcess?.uuid}
							/>
						</Stack>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Stack gap={4} mb={4}>
						<SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
							<Field label='Nombre del curso:'>
								<InputGroup w='100%' startElement={<FiSearch />}>
									<Input
										ml='1'
										size='sm'
										bg={'white'}
										placeholder='Buscar por nombre del curso...'
										value={searchName}
										onChange={(e) => setSearchName(e.target.value)}
									/>
								</InputGroup>
							</Field>
							<Field label='Buscar por programa:'>
								<ReactSelect
									placeholder='Buscar por programa...'
									options={EnrollmentProgramOptions}
									value={selectedProgram}
									onChange={setSelectedProgram}
									isClearable
									isLoading={isLoadingEnrollmentProgram}
								/>
							</Field>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>

			<EnrolledCourseGroupsTable
				programOptions={EnrollmentProgramOptions}
				data={filteredCourseGroups}
				fetchData={fetchCourseGroups}
				isLoading={isLoading}
				hasNextPage={hasNextPageCourseGroups}
				fetchNextPage={fetchNextCourseGroups}
				isFetchingNextPage={isFetchingNextCourseGroups}
				totalCount={totalCount}
				permissions={permissions}
			/>
		</Box>
	);
};
