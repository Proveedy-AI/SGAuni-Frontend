import { useParams } from 'react-router';
import {
	Box,
	Card,
	Heading,
	Text,
	Input,
	Flex,
	Stack,
	SimpleGrid,
	Icon,
} from '@chakra-ui/react';
import { useGenerateGradesReport, useReadCourseGroupById, useReadEvaluationSummaryByCourse } from '@/hooks/course_groups';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { useReadStudentsByCourseId } from '@/hooks/students';
import { useState } from 'react';
import { ReactSelect } from '@/components';
import { Button, Field } from '@/components/ui';
import { FiBook, FiTrash, FiUsers } from 'react-icons/fi';
import { MdGroup, MdPerson } from 'react-icons/md';
import { StudentsEvaluationsTable } from '@/components/tables/myclasses/StudentsEvaluationsTable';
import { ConfigurateCalificationCourseModal, LoadEvaluationsByExcelModal } from '@/components/modals/myclasses';
import { GenerateGradesReportPdfModal } from '@/components/modals/myclasses/GenerateGradesReportPdfModal';

export const ClassMyStudentsByCourseView = () => {
	const { courseId } = useParams();
	const decoded = decodeURIComponent(courseId);
	const decrypted = Encryptor.decrypt(decoded);

	const {
		data: dataCourseGroup,
		isLoading: loadingCourseGroup,
	} = useReadCourseGroupById(
    decrypted,
    { enabled: !!decrypted }
  );

  const {
    data: dataEvaluationSummary,
    refetch: refetchEvaluationSummary,
  } = useReadEvaluationSummaryByCourse(
    decrypted, 
    {},
    { enabled: !!decrypted }
  );

  const evaluationComponents = dataEvaluationSummary?.data?.evaluation_components || [];

  const has_configured = dataEvaluationSummary?.data?.evaluation_configured || false;
  
	const { data: studentsData, isLoading: loadingStudents, refetch: fetchStudents } =
		useReadStudentsByCourseId(
      dataCourseGroup?.id,
      { enabled: !!dataCourseGroup?.id }
    );

	const [filteredName, setFilteredName] = useState('');
	const [selectedStatus, setSelectedStatus] = useState(null);

	const filteredStudents = studentsData?.students?.filter((student) => {
		const matchesName = student.student_name
			.toLowerCase()
			.includes(filteredName.toLowerCase());
		const matchesStatus = selectedStatus
			? student.qualification_status === selectedStatus.value
			: true;
		return matchesName && matchesStatus;
	});

	const StatusOptions = [
		{ value: 1, label: 'En Curso' },
		{ value: 2, label: 'Calificado' },
		{ value: 3, label: 'No Calificado' },
		{ value: 4, label: 'Aprobado' },
		{ value: 5, label: 'Reprobado' },
	];

	const hasActiveFilters = filteredName || selectedStatus;

	const clearFilters = () => {
		setFilteredName('');
		setSelectedStatus(null);
	};

  const {
    data: dataGradesReport,
    isLoading: loadingGradesReport,
    refetch: fetchGradesReport
  } = useGenerateGradesReport(decrypted);

  const isDownloadable = (!loadingGradesReport) && (studentsData?.students?.length > 0);

	return (
		<Box p={4}>
			<Card.Root mb={6} overflow='hidden'>
				<Card.Header>
					<Flex align='center' gap={2}>
						<Icon as={FiBook} boxSize={5} color='blue.600' />
						<Heading fontSize='24px'>{loadingCourseGroup ? 'Cargando...' : dataCourseGroup?.course_name}</Heading>
					</Flex>
					<Text fontSize='sm' color='gray.500'>
						Código: {loadingCourseGroup ? 'Cargando...' : dataCourseGroup?.course_code} | Grupo:{' '}
						{loadingCourseGroup ? 'Cargando...' : dataCourseGroup?.group_code}
					</Text>
				</Card.Header>
				<Card.Body px={4} py={3}>
					<Stack spacing={3}>
						<Flex align='center' gap={2}>
							<Icon as={MdPerson} boxSize={5} color='gray.600' />
							<Text fontWeight='medium' color='gray.700'>
								Docente:
								<Text as='span' fontWeight='semibold' ml={1}>
									{loadingCourseGroup ? 'Cargando...' :  dataCourseGroup?.teacher_name || '—'}
								</Text>
							</Text>
						</Flex>

						<Flex align='center' gap={2}>
							<Icon as={MdGroup} boxSize={5} color='gray.600' />
							<Text fontWeight='medium' color='gray.700'>
								Capacidad:
								<Text as='span' fontWeight='semibold' ml={1}>
									{loadingCourseGroup ? 'Cargando...' : dataCourseGroup?.capacity ?? '—'}
								</Text>
							</Text>
						</Flex>
					</Stack>
				</Card.Body>
			</Card.Root>

			<Card.Root mb={6} overflow='hidden'>
				<Card.Header>
					<Flex
						direction={{ base: 'column', md: 'row' }}
						justify='space-between'
						align={{ base: 'flex-start', md: 'center' }}
						gap={{ base: 4, md: 0 }}
					>
						<Flex align='center' gap={2}>
							<Icon as={FiUsers} boxSize={5} color='blue.600' />
							<Heading fontSize={{ base: 'lg', md: '24px' }}>
								Estudiantes del curso
							</Heading>
						</Flex>

						<Stack
							spacing={2}
							justify='flex-end'
							w={{ base: '100%', md: 'auto' }}
              overflow='hidden'
              direction={{ base: 'column', md: 'row' }}
						>
							{hasActiveFilters && (
								<Button
									variant='outline'
									colorPalette='red'
									size='sm'
									onClick={clearFilters}
									leftIcon={<FiTrash />}
								>
									Limpiar Filtros
								</Button>
							)}

              <GenerateGradesReportPdfModal 
                dataGradesReport={dataGradesReport}
                isLoading={isDownloadable}
              />
						</Stack>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Stack gap={4} mb={4}>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
							<Field label='Filtrar por nombre'>
								<Input
									type='text'
									value={filteredName}
									onChange={(e) => setFilteredName(e.target.value)}
									placeholder='Buscar por nombre'
								/>
							</Field>
							<Field label='Filtrar por estado'>
								<ReactSelect
									options={StatusOptions}
									value={selectedStatus}
									onChange={setSelectedStatus}
									isClearable
									placeholder='Filtrar por estado'
								/>
							</Field>
						</SimpleGrid>

						<SimpleGrid
							columns={{ base: 1, sm: 2, md: 2 }}
							gap={3}
							
							justifyContent='end'
						>
							<LoadEvaluationsByExcelModal 
                dataCourseGroup={dataCourseGroup}
                fetchData={fetchStudents}
                fetchGradesReport={fetchGradesReport}
              />

							<ConfigurateCalificationCourseModal
                fetchData={refetchEvaluationSummary}
                courseGroup={dataCourseGroup}
                data={dataEvaluationSummary?.data}
								evaluationComponents={evaluationComponents}
				        hasConfiguration={has_configured}
							/>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>

			<StudentsEvaluationsTable
        fetchData={fetchStudents}
        fetchGradesReport={fetchGradesReport}
				students={filteredStudents}
				evaluationComponents={evaluationComponents}
				isLoading={loadingStudents}
				hasConfiguration={has_configured}
			/>
		</Box>
	);
};
