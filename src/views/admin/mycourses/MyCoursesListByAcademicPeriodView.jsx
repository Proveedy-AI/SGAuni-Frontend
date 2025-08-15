import { Encryptor } from '@/components/CrytoJS/Encryptor';
import {
	useReadAcademicProgress,
	useReadAcademicTranscript,
	useReadCoursesByPeriod,
} from '@/hooks/students';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { Box, Heading, Text, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useReadMyPrograms } from '@/hooks/person/useReadMyPrograms';
import { useState, useEffect } from 'react';
import { ReactSelect } from '@/components';
import { AcademicProgressSection, CoursesByPeriodSection } from './sections';

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

	console.log(filteredAcademicProgressByProgram);

	return (
		<Box p={6} maxW='full' mx='auto'>
			<Box>
				<Heading my={3}>
					<Stack
						justify={'space-between'}
						align='center'
						direction={{ base: 'column', md: 'row' }}
					>
						<Text fontWeight='bold' color='blue.700'>
							Historial académico
						</Text>
						<ReactSelect
							isLoading={isLoadingMyPrograms}
							options={MyProgramsOptions}
							value={programEnrolled}
							onChange={setProgramEnrolled}
						/>
					</Stack>
				</Heading>
			</Box>
			<CoursesByPeriodSection
				dataAcademicTranscript={dataAcademicTranscript}
				isDownloadable={isDownloadable}
				isLoadingCoursesByPeriod={isLoadingCoursesByPeriod}
				dataCoursesByPeriod={dataCoursesByPeriod}
				handleRowClick={handleRowClick}
				handleClickToProcessEnrollment={handleClickToProcessEnrollment}
			/>
			<AcademicProgressSection
				academicProgress={filteredAcademicProgressByProgram}
				isLoading={isLoadingAcademicProgress}
			/>
		</Box>
	);
};
