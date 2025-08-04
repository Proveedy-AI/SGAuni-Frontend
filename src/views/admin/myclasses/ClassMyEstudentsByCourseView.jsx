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
	IconButton,
} from '@chakra-ui/react';
import { useReadCourseGroupById } from '@/hooks/course_groups';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { useReadStudentsByCourseId } from '@/hooks/students';
import { useState } from 'react';
import { ReactSelect } from '@/components';
import { Button, Field } from '@/components/ui';
import { FiBook, FiTrash, FiUpload, FiUsers } from 'react-icons/fi';
import { ConfigurateCalificationCourseModal } from '@/components/modals/myclasses/ConfigurateCalificationCourseModal';
import { MdGroup, MdPerson } from 'react-icons/md';
import { useReadEvaluationsComponents } from '@/hooks/evaluation_components';
import { StudentsEvaluationsTable } from '@/components/tables/myclasses/StudentsEvaluationsTable';

export const ClassMyEstudentsByCourseView = () => {
	const { courseId } = useParams();
	const decoded = decodeURIComponent(courseId);
	const decrypted = Encryptor.decrypt(decoded);

	const {
		data: dataCourseGroup,
		isLoading: loadingCourseGroup,
	} = useReadCourseGroupById(decrypted, {});

  const {
    data: dataEvaluationComponents,
    refetch: refetchEvaluationComponents,
  } = useReadEvaluationsComponents();

  const filteredByCourseGroup = dataEvaluationComponents?.results?.filter(
    (component) => component.course_group === dataCourseGroup?.id
  );


  const has_configured = filteredByCourseGroup?.length > 0;
  // null: sin configuración ,1: Porcentaje, 2: Promedio simple, 3: Conceptual
	const mode_calification = has_configured ? 1 : filteredByCourseGroup?.[0]?.mode_calification || 1;
  console.log(dataCourseGroup?.id)
	const { data: studentsData, isLoading: loadingStudents } =
		useReadStudentsByCourseId(dataCourseGroup?.id, {});

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

	return (
		<Box p={4}>
			<Card.Root mb={6}>
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

			<Card.Root>
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
							direction='row'
							spacing={2}
							align='center'
							justify='flex-end'
							w={{ base: '100%', md: 'auto' }}
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
							<IconButton
								size='sm'
								bg='white'
								color='blue.600'
								border='1px solid'
								px={4}
								icon={<FiUpload />}
							>
								Subir Notas
							</IconButton>

							<ConfigurateCalificationCourseModal
                fetchData={refetchEvaluationComponents}
                courseGroup={dataCourseGroup}
								evaluationComponents={filteredByCourseGroup}
								mode_calification={mode_calification}
							/>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>

			<StudentsEvaluationsTable
				students={filteredStudents}
				evaluationComponents={filteredByCourseGroup}
				isLoading={loadingStudents}
				hasConfiguration={has_configured}
			/>
		</Box>
	);
};
