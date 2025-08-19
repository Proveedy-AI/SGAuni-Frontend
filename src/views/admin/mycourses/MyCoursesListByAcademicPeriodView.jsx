import { Encryptor } from '@/components/CrytoJS/Encryptor';
import {
	useReadAcademicProgress,
	useReadAcademicTranscript,
	useReadCoursesByPeriod,
} from '@/hooks/students';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { Box, Heading, Text, Stack, Flex, SimpleGrid, Tabs } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useReadMyPrograms } from '@/hooks/person/useReadMyPrograms';
import { useState, useEffect } from 'react';
import { ReactSelect } from '@/components';
import { AcademicProgressSection, CoursesByPeriodSection } from './sections';
import { GenerateAcademicTranscriptPdfModal } from '@/components/modals/mycourses';

export const MyCoursesListByAcademicPeriodView = () => {
	const { data: dataUser, isLoading } = useReadUserLogged();
	const studentUUID = dataUser?.student?.uuid;

	const { data: dataMyPrograms, isLoading: isLoadingMyPrograms } =
		useReadMyPrograms();

	const MyProgramsOptions = dataMyPrograms?.map((program) => ({
		value: program.program_id,
		label: program.program_name,
	}));

	const [programEnrolled, setProgramEnrolled] = useState(null);
  const [tab, setTab] = useState('courses');

	useEffect(() => {
		if (MyProgramsOptions && !programEnrolled) {
			setProgramEnrolled(MyProgramsOptions[0]);
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
		!isLoading &&
		dataCoursesByPeriod?.total_periods?.length !== 0;

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
		<Box p={6} maxW='full' mx='auto'>
			<Stack>
				<Heading my={4} fontSize='2xl' fontWeight='bold' color='gray.500'>
					Mis Cursos
				</Heading>
			</Stack>

			<Stack bg='blue.100' p={4} borderRadius={6} overflow='hidden'>
				<Flex gap={4} direction={{ base: 'column', lg: 'row' }}>
					<Flex align='center' gap={3} flex={1}>
						<Text
							py={1}
							pr={2}
							color='blue.600'
							fontSize='md'
							fontWeight='bold'
						>
							Programa Académico:
						</Text>
						<Box
							bg='white'
							borderRadius={6}
							flex={1}
							maxW={{ base: 'full', lg: '320px' }}
              fontSize='sm'
            >
							<ReactSelect
								isLoading={isLoadingMyPrograms}
								options={MyProgramsOptions}
								value={programEnrolled}
								onChange={setProgramEnrolled}
							/>
						</Box>
					</Flex>
					<Flex
						w='fit'
						bg='purple.200'
						py={1}
						px={4}
						borderRadius='md'
						alignItems='center'
						fontSize='md'
					>
						<Text fontWeight='bold' color='purple.700'>
							Periodo Académico:
						</Text>
						<Text pl={4}>Ciclo {'string'}</Text>
					</Flex>
				</Flex>
				<Flex
					justify='space-between'
					border='1px solid'
					borderColor='blue.400'
					borderRadius={8}
					direction={{ base: 'column', lg: 'row' }}
					fontSize={'sm'}
				>
					<SimpleGrid
						p={2}
						borderEndWidth={1}
						borderColor='blue.400'
						flex={1}
						columns={1}
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
					<SimpleGrid p={2} flex={1} columns={1}>
						<Text color='gray.500'>
							<b>Inicio de programa:</b>{' '}
							{filteredAcademicProgressByProgram?.program_start_date}
						</Text>
						<Text color='gray.500'>
							<b>Fin de programa:</b> En curso
						</Text>
					</SimpleGrid>
				</Flex>
			</Stack>

      <Tabs.Root
        value={tab}
        onValueChange={(e) => setTab(e.value)}
        variant="plain"
        my={3}
      >
        <Flex justify='space-between' align='center'>
          <Tabs.List bg="blue.100" rounded="l3" p="1">
            <Tabs.Trigger color='blue.600' fontSize={'sm'} value='courses'>
              Cursos
            </Tabs.Trigger>
            <Tabs.Trigger color='blue.600' fontSize={'sm'} value='academic-summary'>
              Resumen Académico
            </Tabs.Trigger>
            <Tabs.Trigger color='blue.600' fontSize={'sm'} value='grades-record'>
              Record de notas
            </Tabs.Trigger>
            <Tabs.Indicator rounded="l2" />
          </Tabs.List>
          {tab === 'courses' && (
            <GenerateAcademicTranscriptPdfModal
              data={dataAcademicTranscript}
              isActive={isDownloadable}
            />
          )}
        </Flex>
        <Tabs.Content value='courses'>
          <CoursesByPeriodSection
            isLoadingCoursesByPeriod={isLoadingCoursesByPeriod}
            dataCoursesByPeriod={dataCoursesByPeriod}
            handleRowClick={handleRowClick}
            handleClickToProcessEnrollment={handleClickToProcessEnrollment}
          />
        </Tabs.Content>
        <Tabs.Content value='academic-summary'>
          <AcademicProgressSection
            academicProgress={filteredAcademicProgressByProgram}
            isLoading={isLoadingAcademicProgress}
          />
        </Tabs.Content>
        <Tabs.Content value='grades-record'>
          Record de notas
        </Tabs.Content>
      </Tabs.Root>
		</Box>
	);
};
