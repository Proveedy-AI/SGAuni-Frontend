import { useParams } from 'react-router';
import {
	Box,
	Card,
	Heading,
	Text,
	Table,
	Input,
	Flex,
	Stack,
	SimpleGrid,
	Icon,
	IconButton,
	Badge,
} from '@chakra-ui/react';
import { useReadCourseGroupById } from '@/hooks/course_groups';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { useReadStudentsByCourseId } from '@/hooks/students';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { useState } from 'react';
import { ReactSelect } from '@/components';
import { Button, Field } from '@/components/ui';
import { FiBook, FiTrash, FiUpload, FiUsers } from 'react-icons/fi';
import { ConfigurateCalificationCourseModal } from '@/components/modals/myclasses/ConfigurateCalificationCourseModal';
import { MdGroup, MdPerson } from 'react-icons/md';

export const ClassMyEstudentsByCourseView = () => {
	const { courseId } = useParams();
	const decoded = decodeURIComponent(courseId);
	const decrypted = Encryptor.decrypt(decoded);

	const {
		data: dataCourseGroup,
		//isLoading: loadingCourseGroup,
	} = useReadCourseGroupById(decrypted, {});

	// simular campos evaluations y has_configured de courseGroup
	const evaluations = [
		{
			id: 1,
			name: 'P1',
			weight: 0.3,
			date: '2023-10-01T00:00:00.000Z',
			createdAt: '2025-10-01T00:00:00.000Z',
			updatedAt: '2025-10-01T00:00:00.000Z',
		},
		{
			id: 2,
			name: 'P2',
			weight: 0.3,
			date: '2023-10-01T00:00:00.000Z',
			createdAt: '2025-10-01T00:00:00.000Z',
			updatedAt: '2025-10-01T00:00:00.000Z',
		},
		{
			id: 3,
			name: 'P3',
			weight: 0.2,
			date: '2023-10-01T00:00:00.000Z',
			createdAt: '2025-10-01T00:00:00.000Z',
			updatedAt: '2025-10-01T00:00:00.000Z',
		},
		{
			id: 4,
			name: 'P4',
			weight: 0.2,
			date: '2023-10-01T00:00:00.000Z',
			createdAt: '2025-10-01T00:00:00.000Z',
			updatedAt: '2025-10-01T00:00:00.000Z',
		},
	];
	const has_configured = true;
	const mode_calification = 2; // null: sin configuración ,1: Porcentaje, 2: Promedio simple, 3: Conceptual

	const { data: studentsData, isLoading: loadingStudents } =
		useReadStudentsByCourseId(decrypted, {});

	console.log(studentsData);
	const dataStudentsLocal = {
		results: [
			{
				id: 1,
				uuid: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
				student_name: 'Juan Pérez',
				qualification_status: 1, // En Curso
				califications: [],
				average: 0.0,
			},
			{
				id: 2,
				uuid: '5fa85f64-5717-4562-b3fc-2c963f66afa8',
				student_name: 'María Gómez',
				qualification_status: 2, // No calificado
				califications: [],
				average: 7.9,
			},
			{
				id: 3,
				uuid: '6fa85f64-5717-4562-b3fc-2c963f66afa9',
				student_name: 'Carlos Ruiz',
				qualification_status: 3, // Calificado
				califications: [],
				average: 9.2,
			},
			{
				id: 4,
				uuid: '7fa85f64-5717-4562-b3fc-2c963f66afaa',
				student_name: 'Ana Torres',
				qualification_status: 1, // En Curso
				califications: [],
				average: 0.0,
			},
		],
	};

	const [filteredName, setFilteredName] = useState('');
	const [selectedStatus, setSelectedStatus] = useState(null);

	const filteredStudents = dataStudentsLocal.results.filter((student) => {
		const matchesName = student.student_name
			.toLowerCase()
			.includes(filteredName.toLowerCase());
		const matchesStatus = selectedStatus
			? student.qualification_status === selectedStatus.value
			: true;
		return matchesName && matchesStatus;
	});

	const StatusColors = [
		{ id: 1, bg: '#AEAEAE', color: '#F5F5F5' },
		{ id: 2, bg: '#C0D7F5', color: '#0661D8' },
		{ id: 3, bg: '#FDD9C6', color: '#F86A1E' },
		{ id: 4, bg: '#D0EDD0', color: '#2D9F2D' },
		{ id: 5, bg: '#F7CDCE', color: '#E0383B' },
	];
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
						<Heading fontSize='24px'>{dataCourseGroup?.course_name}</Heading>
					</Flex>
					<Text fontSize='sm' color='gray.500'>
						Código: {dataCourseGroup?.course_code} | Grupo:{' '}
						{dataCourseGroup?.group_code}
					</Text>
				</Card.Header>
				<Card.Body px={4} py={3}>
					<Stack spacing={3}>
						<Flex align='center' gap={2}>
							<Icon as={MdPerson} boxSize={5} color='gray.600' />
							<Text fontWeight='medium' color='gray.700'>
								Docente:
								<Text as='span' fontWeight='semibold' ml={1}>
									{dataCourseGroup?.teacher_name || '—'}
								</Text>
							</Text>
						</Flex>

						<Flex align='center' gap={2}>
							<Icon as={MdGroup} boxSize={5} color='gray.600' />
							<Text fontWeight='medium' color='gray.700'>
								Capacidad:
								<Text as='span' fontWeight='semibold' ml={1}>
									{dataCourseGroup?.capacity ?? '—'}
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
								evaluations={evaluations}
								mode_calification={mode_calification}
							/>
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>

			<Stack
				bg={{ base: 'white', _dark: 'its.gray.500' }}
				p='3'
				borderRadius='10px'
				overflow='hidden'
				boxShadow='md'
				direction='row'
			>
				<Table.ScrollArea flex={1}>
					<Table.Root size='sm' w='full' striped>
						<Table.Header>
							<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
								<Table.Cell>ID</Table.Cell>
								<Table.Cell>Nombre</Table.Cell>
								<Table.Cell>Estado</Table.Cell>
								{has_configured && (
									<>
										{evaluations.map((evaluation) => (
											<Table.Cell key={evaluation.id}>
												{evaluation.name}
											</Table.Cell>
										))}
										<Table.Cell>Promedio</Table.Cell>
									</>
								)}
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{loadingStudents ? (
								<SkeletonTable columns={4} />
							) : (
								filteredStudents?.map((student) => {
									const statusOption = StatusOptions.find(
										(opt) => opt.value === student.qualification_status
									);
									const statusColor = StatusColors.find(
										(c) => c.id === student.qualification_status
									) || { bg: 'gray.200', color: 'gray.800' };
									return (
										<Table.Row key={student.id}>
											<Table.Cell>{student.id}</Table.Cell>
											<Table.Cell>{student.student_name}</Table.Cell>
											<Table.Cell>
												<Badge
													px={2}
													py={1}
													borderRadius='md'
													fontWeight='bold'
													bg={statusColor.bg}
													color={statusColor.color}
												>
													{statusOption?.label || 'Desconocido'}
												</Badge>
											</Table.Cell>
											{has_configured && (
												<>
													{evaluations.map((evaluation) => (
														<Table.Cell key={evaluation.id}>
															{student.califications.find(
																(c) => c.evaluation_id === evaluation.id
															)?.grade || '-'}
														</Table.Cell>
													))}
													<Table.Cell>{student.average.toFixed(2)}</Table.Cell>
												</>
											)}
										</Table.Row>
									);
								})
							)}
						</Table.Body>
					</Table.Root>
				</Table.ScrollArea>
				{!has_configured && (
					<Box textAlign='center' bg='blue.100' p={4} borderRadius='md'>
						<Text fontWeight='bold' color='blue.700' mb={2}>
							Configura las evaluaciones del curso
						</Text>
						<img
							src='/img/withoutConfigurationExam.webp'
							alt='Sin configuración de evaluaciones'
							style={{ maxWidth: '120px', margin: '0 auto' }}
						/>
					</Box>
				)}
			</Stack>
		</Box>
	);
};
