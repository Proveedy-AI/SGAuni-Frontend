import { Encryptor } from '@/components/CrytoJS/Encryptor';
import {
	useReadAcademicProgress,
	useReadAcademicTranscript,
	useReadCoursesByPeriod,
} from '@/hooks/students';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Box,
	Text,
	Stack,
	Flex,
	SimpleGrid,
	Tabs,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ReactSelect } from '@/components';
import {
	AcademicProgressSection,
	CoursesByPeriodSection,
	GradesRecordSection,
} from './sections';
import { GenerateAcademicTranscriptPdfModal } from '@/components/modals/mycourses';

export const MyCoursesListByAcademicPeriodView = () => {
	const { data: dataUser, isLoading } = useReadUserLogged();
	const studentUUID = dataUser?.student?.uuid;

	const MyProgramsOptions = dataUser?.student?.admission_programs?.map(
		(program) => ({
			value: program.program,
			label: program.program_name,
		})
	);

	const [programEnrolled, setProgramEnrolled] = useState(null);
	const [tab, setTab] = useState('courses');

	useEffect(() => {
		if (MyProgramsOptions && !programEnrolled) {
			setProgramEnrolled(MyProgramsOptions[MyProgramsOptions.length - 1]);
		}
	}, [MyProgramsOptions, programEnrolled]);

	const {
		data: dataAcademicTranscript,
		isLoading: isLoadingAcademicTranscript,
	} = useReadAcademicTranscript(studentUUID, programEnrolled?.value);

	const { data: dataCoursesByPeriod, isLoading: isLoadingCoursesByPeriod } =
		useReadCoursesByPeriod(studentUUID, programEnrolled?.value);

	const isDownloadable =
		!isLoadingAcademicTranscript &&
		dataCoursesByPeriod?.total_courses > 0;

	const navigate = useNavigate();

	const handleRowClick = (course) => {
		const encrypted = Encryptor.encrypt(course.id_course_selection);
		const encoded = encodeURIComponent(encrypted);
		navigate(`/mycourses/${encoded}`);
	};

	const handleClickToProcessEnrollment = () =>
		navigate('/myprocedures/enrollment-process');

	const { data: dataAcademicProgress, isLoading: isLoadingAcademicProgress } =
		useReadAcademicProgress(studentUUID);

	const filteredAcademicProgressByProgram =
		dataAcademicProgress?.programs?.find(
			(data) => data?.program?.id === programEnrolled?.value
		);

	return (
		<Box maxW="full" mx="auto">
			<Stack bg="blue.100" p={{ base: 3, md: 4 }} borderRadius={6} spacing={4}>
				{/* Selector de programa */}
				<Flex
					gap={4}
					direction={{ base: 'column', lg: 'row' }}
					align={{ base: 'stretch', lg: 'center' }}
				>
					<Flex align="center" gap={3} flex={1} direction={{ base: 'column', md: 'row' }}>
						<Text
							py={1}
							pr={{ base: 0, md: 2 }}
							color="blue.600"
							fontSize="md"
							fontWeight="bold"
							textAlign={{ base: 'center', md: 'left' }}
						>
							Programa Académico:
						</Text>
						<Box
							bg="white"
							borderRadius={6}
							w={{ base: 'full', md: '100%', lg: '320px' }}
							fontSize="sm"
						>
							<ReactSelect
								isLoading={isLoading}
								options={MyProgramsOptions}
								value={programEnrolled}
								onChange={setProgramEnrolled}
							/>
						</Box>
					</Flex>
				</Flex>
				<Flex
					justify="space-between"
					border="1px solid"
					borderColor="blue.400"
					borderRadius={8}
					direction={{ base: 'column', md: 'row' }}
					fontSize="sm"
					overflow="hidden"
				>
					<SimpleGrid
						p={3}
						borderBottom={{ base: '1px solid', md: '0' }}
						borderRight={{ base: '0', md: '1px solid' }}
						borderColor="blue.400"
						flex={1}
						columns={1}
						spacing={1}
					>
						<Text>
							<b>Programa:</b>{' '}
							{filteredAcademicProgressByProgram?.program?.name}
						</Text>
						<Text>
							<b>Año de admisión:</b>{' '}
							{filteredAcademicProgressByProgram?.admission_year}
						</Text>
					</SimpleGrid>
					<SimpleGrid p={3} flex={1} columns={1} spacing={1}>
						<Text color="gray.500">
							<b>Inicio de programa:</b>{' '}
							{filteredAcademicProgressByProgram?.program_start_date}
						</Text>
						<Text color="gray.500">
							<b>Fin de programa:</b> En curso
						</Text>
					</SimpleGrid>
				</Flex>
			</Stack>

			{/* Tabs */}
			<Tabs.Root
				value={tab}
				onValueChange={(e) => setTab(e.value)}
				variant="plain"
				my={4}
			>
				<Flex
					overflow="auto"
					direction={{ base: 'column', md: 'row' }}
					justify="space-between"
					align={{ base: 'flex-start', md: 'center' }}
					gap={3}
					w="full"
				>
					<Tabs.List
						bg="blue.100"
						rounded="l3"
						p="1"
						flexShrink={0}
						display="flex"
					>
						<Tabs.Trigger color="blue.600" fontSize="sm" value="courses">
							Cursos
						</Tabs.Trigger>
						<Tabs.Trigger color="blue.600" fontSize="sm" value="academic-summary">
							Resumen Académico
						</Tabs.Trigger>
						<Tabs.Trigger color="blue.600" fontSize="sm" value="grades-record">
							Record de notas
						</Tabs.Trigger>
						<Tabs.Indicator rounded="l2" />
					</Tabs.List>
					{(tab === 'courses' || tab === 'grades-record') && (
						<Box mt={{ base: 2, md: 0 }}>
							<GenerateAcademicTranscriptPdfModal
								data={dataAcademicTranscript}
								isActive={isDownloadable}
							/>
						</Box>
					)}
				</Flex>

				<Tabs.Content value="courses">
					<CoursesByPeriodSection
						isLoadingCoursesByPeriod={isLoadingCoursesByPeriod}
						dataCoursesByPeriod={dataCoursesByPeriod}
						handleRowClick={handleRowClick}
						handleClickToProcessEnrollment={handleClickToProcessEnrollment}
					/>
				</Tabs.Content>
				<Tabs.Content value="academic-summary">
					<AcademicProgressSection
						academicProgress={filteredAcademicProgressByProgram}
						isLoading={isLoadingAcademicProgress}
					/>
				</Tabs.Content>
				<Tabs.Content value="grades-record">
					<GradesRecordSection dataCoursesByPeriod={dataCoursesByPeriod} />
				</Tabs.Content>
			</Tabs.Root>
		</Box>
	);
};
