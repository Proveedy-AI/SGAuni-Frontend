import {
	Button,
	Box,
	Text,
	Grid,
	GridItem,
	VStack,
	HStack,
	Badge,
	Input,
	Tabs,
	Table,
	Card,
	Heading,
	IconButton,
	Flex,
} from '@chakra-ui/react';

import PropTypes from 'prop-types';
import {
	FiBookOpen,
	FiCalendar,
	FiClock,
	FiGrid,
	FiList,
	FiUpload,
	FiUsers,
} from 'react-icons/fi';
import { Field, Modal } from '@/components/ui';
import { ReactSelect } from '@/components/select';
import { useState } from 'react';

// Datos de ejemplo basados en la estructura proporcionada
const scheduleData = [
	{
		id: 1,
		course_schedule: 1,
		course_name: 'Matemáticas Básicas',
		course_group_code: 'MAT-101-A',
		enrollment_period_program: '2024-1',
		teacher_name: 'Dr. Juan Pérez',
		day_of_week: 'Lunes',
		capacity: 30,
		start_time: '08:00',
		end_time: '10:00',
		status_review: 1,
		status_review_display: 'Aprobado',
		is_mandatory: true,
		cycle: 'I',
		credits: 4,
	},
	{
		id: 2,
		course_schedule: 2,
		course_name: 'Física General',
		course_group_code: 'FIS-201-B',
		enrollment_period_program: '2024-1',
		teacher_name: 'Dra. María García',
		day_of_week: 'Martes',
		capacity: 25,
		start_time: '10:00',
		end_time: '12:00',
		status_review: 0,
		status_review_display: 'Pendiente',
		is_mandatory: false,
		cycle: 'II',
		credits: 3,
	},
	{
		id: 3,
		course_schedule: 3,
		course_name: 'Programación I',
		course_group_code: 'PRG-101-A',
		enrollment_period_program: '2024-1',
		teacher_name: 'Ing. Carlos López',
		day_of_week: 'Miércoles',
		capacity: 20,
		start_time: '14:00',
		end_time: '16:00',
		status_review: 1,
		status_review_display: 'Aprobado',
		is_mandatory: true,
		cycle: 'I',
		credits: 5,
	},
	{
		id: 4,
		course_schedule: 4,
		course_name: 'Química Orgánica',
		course_group_code: 'QUI-301-A',
		enrollment_period_program: '2024-1',
		teacher_name: 'Dr. Ana Martínez',
		day_of_week: 'Jueves',
		capacity: 15,
		start_time: '09:00',
		end_time: '11:00',
		status_review: 1,
		status_review_display: 'Aprobado',
		is_mandatory: true,
		cycle: 'III',
		credits: 4,
	},
	{
		id: 5,
		course_schedule: 5,
		course_name: 'Historia del Arte',
		course_group_code: 'ART-101-B',
		enrollment_period_program: '2024-1',
		teacher_name: 'Prof. Luis Rodríguez',
		day_of_week: 'Viernes',
		capacity: 40,
		start_time: '16:00',
		end_time: '18:00',
		status_review: 0,
		status_review_display: 'Pendiente',
		is_mandatory: false,
		cycle: 'I',
		credits: 2,
	},
	{
		id: 6,
		course_schedule: 6,
		course_name: 'Estadística',
		course_group_code: 'EST-201-A',
		enrollment_period_program: '2024-1',
		teacher_name: 'Dra. Carmen Silva',
		day_of_week: 'Lunes',
		capacity: 35,
		start_time: '14:00',
		end_time: '16:00',
		status_review: 1,
		status_review_display: 'Aprobado',
		is_mandatory: true,
		cycle: 'II',
		credits: 3,
	},
	{
		id: 6,
		course_schedule: 6,
		course_name: 'Física',
		course_group_code: 'FIS-201-A',
		enrollment_period_program: '2024-1',
		teacher_name: 'Dra. Pedro Aliaga',
		day_of_week: 'Lunes',
		capacity: 35,
		start_time: '14:00',
		end_time: '16:00',
		status_review: 1,
		status_review_display: 'Aprobado',
		is_mandatory: true,
		cycle: 'II',
		credits: 3,
	},
	{
		id: 6,
		course_schedule: 6,
		course_name: 'Física',
		course_group_code: 'FIS-201-A',
		enrollment_period_program: '2024-1',
		teacher_name: 'Dra. Pedro Aliaga',
		day_of_week: 'Lunes',
		capacity: 35,
		start_time: '14:00',
		end_time: '16:00',
		status_review: 1,
		status_review_display: 'Aprobado',
		is_mandatory: true,
		cycle: 'II',
		credits: 3,
	},
	{
		id: 6,
		course_schedule: 6,
		course_name: 'Física',
		course_group_code: 'FIS-201-A',
		enrollment_period_program: '2024-1',
		teacher_name: 'Dra. Pedro Aliaga',
		day_of_week: 'Lunes',
		capacity: 35,
		start_time: '15:00',
		end_time: '17:00',
		status_review: 1,
		status_review_display: 'Aprobado',
		is_mandatory: true,
		cycle: 'II',
		credits: 3,
	},
];

const timeSlots = [
	'07:00',
	'08:00',
	'09:00',
	'10:00',
	'11:00',
	'12:00',
	'13:00',
	'14:00',
	'15:00',
	'16:00',
	'17:00',
	'18:00',
	'19:00',
];

const daysOfWeek = [
	'Lunes',
	'Martes',
	'Miércoles',
	'Jueves',
	'Viernes',
	'Sábado',
];

const daysOfWeekOptions = daysOfWeek.map((day) => ({
	value: day.toLowerCase(),
	label: day,
}));

const cycleOptions = ['I', 'II', 'III', 'IV', 'V'].map((cycle) => ({
	value: cycle,
	label: cycle,
}));

const AddCourseModal = ({ open, setOpen }) => {
	const [formData, setFormData] = useState({
		courseName: '',
		groupCode: '',
		teacher: '',
		dayOfWeek: null,
		capacity: '',
		startTime: '',
		endTime: '',
		cycle: null,
		credits: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSelectChange = (name) => (option) => {
		setFormData((prev) => ({
			...prev,
			[name]: option?.value || null,
		}));
	};

	return (
		<Modal
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			trigger={
				<Box>
					<IconButton
						variant='outline'
						size='xs'
						px={2}
						borderColor='uni.secondary'
						color='uni.secondary'
						css={{
							_icon: {
								width: '5',
								height: '5',
							},
						}}
					>
						<FiBookOpen /> Agregar Curso
					</IconButton>
				</Box>
			}
			title='Agregar Nuevo Curso'
			description='Complete la información del nuevo curso para el cronograma'
			size='md'
		>
			<VStack spacing={4}>
				<Field label='Nombre del Curso'>
					<Input
						name='courseName'
						value={formData.courseName}
						onChange={handleInputChange}
						placeholder='Ej: Matemáticas Básicas'
						size='xs'
					/>
				</Field>

				<Field label='Código del Grupo'>
					<Input
						name='groupCode'
						value={formData.groupCode}
						onChange={handleInputChange}
						placeholder='Ej: MAT-101-A'
						size='xs'
					/>
				</Field>

				<Field label='Profesor'>
					<Input
						name='teacher'
						value={formData.teacher}
						onChange={handleInputChange}
						placeholder='Nombre del profesor'
						size='xs'
					/>
				</Field>

				<Grid templateColumns='repeat(2, 1fr)' gap={4} w='full'>
					<GridItem>
						<Field label='Día de la Semana'>
							<ReactSelect
								value={daysOfWeekOptions.find(
									(option) => option.value === formData.dayOfWeek
								)}
								onChange={handleSelectChange('dayOfWeek')}
								options={daysOfWeekOptions}
								isClearable
								placeholder='Seleccionar día'
								size='xs'
							/>
						</Field>
					</GridItem>
					<GridItem>
						<Field label='Capacidad'>
							<Input
								name='capacity'
								value={formData.capacity}
								onChange={handleInputChange}
								type='number'
								placeholder='30'
								size='xs'
							/>
						</Field>
					</GridItem>
				</Grid>

				<Grid templateColumns='repeat(2, 1fr)' gap={4} w='full'>
					<GridItem>
						<Field label='Hora Inicio'>
							<Input
								name='startTime'
								value={formData.startTime}
								onChange={handleInputChange}
								type='time'
								size='xs'
							/>
						</Field>
					</GridItem>
					<GridItem>
						<Field label='Hora Fin'>
							<Input
								name='endTime'
								value={formData.endTime}
								onChange={handleInputChange}
								type='time'
								size='xs'
							/>
						</Field>
					</GridItem>
				</Grid>

				<Grid templateColumns='repeat(2, 1fr)' gap={4} w='full'>
					<GridItem>
						<Field label='Ciclo'>
							<ReactSelect
								value={cycleOptions.find(
									(option) => option.value === formData.cycle
								)}
								onChange={handleSelectChange('cycle')}
								options={cycleOptions}
								isClearable
								placeholder='Seleccionar ciclo'
								size='xs'
							/>
						</Field>
					</GridItem>
					<GridItem>
						<Field label='Créditos'>
							<Input
								name='credits'
								value={formData.credits}
								onChange={handleInputChange}
								type='number'
								placeholder='4'
								size='xs'
							/>
						</Field>
					</GridItem>
				</Grid>
			</VStack>
		</Modal>
	);
};

AddCourseModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};

const AddExcelScheduleModal = ({ open, setOpen }) => {
	const [file, setFile] = useState(null);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			const fileType = selectedFile.type;
			if (
				[
					'application/vnd.ms-excel',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				].includes(fileType)
			) {
				setFile(selectedFile);
			} else {
				alert('Solo se permiten archivos Excel');
				e.target.value = '';
			}
		}
	};

	return (
		<Modal
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			title='Importar Cronograma desde Excel'
			trigger={
				<Box>
					<IconButton
						variant='solid'
						size='xs'
						px={2}
						bg='uni.secondary'
						color='white'
						css={{
							_icon: {
								width: '5',
								height: '5',
							},
						}}
					>
						<FiCalendar /> Importar cronograma
					</IconButton>
				</Box>
			}
			description='Suba un archivo Excel con el cronograma de cursos'
			size='md'
		>
			<VStack spacing={4}>
				<Field label='Archivo Excel'>
					<Input
						type='file'
						onChange={handleFileChange}
						accept='.xlsx,.xls'
						size='xs'
					/>
				</Field>

				<Box
					w='full'
					border='2px'
					borderStyle='dashed'
					borderColor='gray.300'
					rounded='lg'
					p={6}
					textAlign='center'
				>
					<FiUpload className='mx-auto h-12 w-12' color='gray.400' />
					<Text mt={2} fontSize='sm' color='gray.600'>
						Arrastra y suelta tu archivo Excel aquí, o haz clic para seleccionar
					</Text>
				</Box>

				<VStack spacing={1} alignItems='start' w='full'>
					<Text fontSize='xs' color='gray.500'>
						Formato requerido: .xlsx o .xls
					</Text>
					<Text fontSize='xs' color='gray.500'>
						El archivo debe contener las columnas: Nombre del Curso, Código,
						Profesor, Día, Horario, etc.
					</Text>
				</VStack>
			</VStack>
		</Modal>
	);
};

AddExcelScheduleModal.propTypes = {
	open: PropTypes.bool.isRequired,
	setOpen: PropTypes.func.isRequired,
};

const CalendarView = ({ data }) => {
	const headerBg = 'gray.50';
	const bgApproved = 'green.100';
	const bgPending = 'yellow.100';
	const borderApproved = 'green.500';
	const borderPending = 'yellow.500';

	const getCourseForTimeSlot = (day, time) => {
		return data.filter((course) => {
			if (course.day_of_week !== day) return false;
			const courseStart = Number.parseInt(course.start_time.split(':')[0]);
			const courseEnd = Number.parseInt(course.end_time.split(':')[0]);
			const slotTime = Number.parseInt(time.split(':')[0]);
			return slotTime >= courseStart && slotTime < courseEnd;
		});
	};

	const getCourseHeight = (course) => {
		const start = Number.parseInt(course.start_time.split(':')[0]);
		const end = Number.parseInt(course.end_time.split(':')[0]);
		return (end - start) * 60; // 60px por hora
	};

	return (
		<Box overflowX='auto'>
			<Box minW='800px'>
				{/* Header con días */}
				<Grid templateColumns='auto repeat(6, 1fr)' gap={1} mb={2}>
					<Box p={2} textAlign='center' fontWeight='medium' fontSize='sm'>
						Hora
					</Box>
					{daysOfWeek.map((day) => (
						<Box
							key={day}
							p={2}
							textAlign='center'
							fontWeight='medium'
							fontSize='sm'
							bg={headerBg}
							rounded='md'
						>
							{day}
						</Box>
					))}
				</Grid>

				{/* Grid del calendario */}
				{timeSlots.map((time) => (
					<Grid key={time} templateColumns='auto repeat(6, 1fr)' gap={1}>
						<Box
							p={2}
							fontSize='xs'
							color='gray.500'
							textAlign='center'
							borderRight='1px'
							borderColor='gray.200'
						>
							{time}
						</Box>

						{daysOfWeek.map((day) => {
							const courses = getCourseForTimeSlot(day, time);

							return (
								<Box
									key={`${day}-${time}`}
									position='relative'
									h='48px'
									border='1px solid'
									borderColor='gray.50'
								>
									{courses.map((course, index) => {
										const isFirstSlotOfCourse = course.start_time.startsWith(
											time.split(':')[0]
										);
										if (!isFirstSlotOfCourse) return null;

										const totalCourses = courses.length;
										const width = `${100 / totalCourses}%`;
										const left = `${(100 / totalCourses) * index}%`;

										return (
											<Box
												key={course.id}
												position='absolute'
												top={0}
												left={left}
												width={width}
												p={1}
												rounded='md'
												overflow='hidden'
												bg={course.status_review === 1 ? bgApproved : bgPending}
												borderLeft='4px solid'
												borderLeftColor={
													course.status_review === 1
														? borderApproved
														: borderPending
												}
												height={`${getCourseHeight(course)}px`}
												transition='all 0.2s ease-in-out'
												cursor='pointer'
												_hover={{
													zIndex: 10,
													transform: 'scale(1.1)',
													boxShadow: 'xl',
													width: '100%',
													left: index === totalCourses - 1 ? 'auto' : left,
													right: index === totalCourses - 1 ? '0' : 'auto',
													bg:
														course.status_review === 1
															? 'green.200'
															: 'yellow.200',
												}}
											>
												<Text fontWeight='medium' fontSize='xs' noOfLines={1}>
													{course.course_name}
												</Text>
												<Text fontSize='xs' color='gray.600' noOfLines={1}>
													{course.course_group_code}
												</Text>
												<Text fontSize='xs' color='gray.500' noOfLines={1}>
													{course.teacher_name}
												</Text>
												<Text fontSize='xs' color='gray.500' noOfLines={1}>
													{course.start_time} - {course.end_time}
												</Text>
												<HStack
													spacing={1}
													mt={1}
													justifyContent={'space-between'}
												>
													<HStack>
														<FiUsers size={12} />
														<Text fontSize='xs'>{course.capacity}</Text>
													</HStack>
													<HStack>
														<Text fontSize='xs'>{course.cycle}</Text>
														{course.is_mandatory && (
															<Badge
																colorPalette='red'
																fontSize='xx-small'
																px={1}
																py={0}
															>
																Obl
															</Badge>
														)}
													</HStack>
												</HStack>
											</Box>
										);
									})}
								</Box>
							);
						})}
					</Grid>
				))}
			</Box>
		</Box>
	);
};

CalendarView.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			course_name: PropTypes.string.isRequired,
			course_group_code: PropTypes.string.isRequired,
			teacher_name: PropTypes.string.isRequired,
			day_of_week: PropTypes.string.isRequired,
			start_time: PropTypes.string.isRequired,
			end_time: PropTypes.string.isRequired,
			status_review: PropTypes.number.isRequired,
			capacity: PropTypes.number.isRequired,
			is_mandatory: PropTypes.bool.isRequired,
		})
	).isRequired,
};

export const ScheduleEnrollmentProgramsModal = () => {
	const [open, setOpen] = useState(false);
	const [addCourseOpen, setAddCourseOpen] = useState(false);
	const [addExcelOpen, setAddExcelOpen] = useState(false);
	const [tab, setTab] = useState(1);
	const getStatusBadge = (status, statusDisplay) => {
		return (
			<Badge colorPalette={status === 1 ? 'green' : 'gray'}>
				{statusDisplay}
			</Badge>
		);
	};

	return (
		<Modal
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			size='7xl'
			trigger={
				<Button variant='outline' size='sm' colorPalette={'blue'}>
					<FiCalendar size={16} />
					Cronograma
				</Button>
			}
			title={
				<HStack>
					<FiCalendar size={20} />
					<Text>Gestión de Cronograma de Matricula</Text>
				</HStack>
			}
			hiddenFooter={true}
		>
			{/* Botones de Acción */}
			<HStack gap={3} borderBottomWidth={1} justifyContent={'end'}>
				<AddCourseModal open={addCourseOpen} setOpen={setAddCourseOpen} />
				<AddExcelScheduleModal open={addExcelOpen} setOpen={setAddExcelOpen} />
			</HStack>

			<Grid
				templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
				gap={4}
				py={2}
			>
				<Card.Root>
					<Card.Header>
						<Flex justify='space-between' align='center'>
							<Heading size='sm'>Total Cursos</Heading>
							<FiBookOpen size={16} color='gray.500' />
						</Flex>
					</Card.Header>
					<Card.Body>
						<Heading size='lg'>{scheduleData.length}</Heading>
					</Card.Body>
				</Card.Root>
				<Card.Root>
					<Card.Header>
						<Flex justify='space-between' align='center'>
							<Heading size='sm'>Capacidad Total</Heading>
							<FiUsers size={16} color='gray.500' />
						</Flex>
					</Card.Header>
					<Card.Body>
						<Heading size='lg'>
							{scheduleData.reduce((sum, course) => sum + course.capacity, 0)}
						</Heading>
					</Card.Body>
				</Card.Root>
				<Card.Root>
					<Card.Header>
						<Flex justify='space-between' align='center'>
							<Heading size='sm'>Cursos Aprobados</Heading>
							<FiClock size={16} color='gray.500' />
						</Flex>
					</Card.Header>
					<Card.Body>
						<Heading size='lg'>
							{
								scheduleData.filter((course) => course.status_review === 1)
									.length
							}
						</Heading>
					</Card.Body>
				</Card.Root>
				<Card.Root>
					<Card.Header>
						<Flex justify='space-between' align='center'>
							<Heading size='sm'>Créditos Totales</Heading>
							<FiBookOpen size={16} color='gray.500' />
						</Flex>
					</Card.Header>
					<Card.Body>
						<Heading size='lg'>
							{scheduleData.reduce((sum, course) => sum + course.credits, 0)}
						</Heading>
					</Card.Body>
				</Card.Root>
			</Grid>

			{/* Tabs */}
			<Tabs.Root value={tab} onValueChange={(e) => setTab(e.value)}>
				<Tabs.List>
					<Tabs.Trigger value={1}>
						<HStack>
							<FiGrid size={16} />
							<Text>Vista Calendario</Text>
						</HStack>
					</Tabs.Trigger>
					<Tabs.Trigger value={2}>
						<HStack>
							<FiList size={16} />
							<Text>Vista Lista</Text>
						</HStack>
					</Tabs.Trigger>
				</Tabs.List>

				<Tabs.Content value={1}>
					<CalendarView data={scheduleData} />
				</Tabs.Content>

				<Tabs.Content value={2}>
					<Box overflowX='auto'>
						<Table.Root variant='simple'>
							<Table.Header>
								<Table.Row>
									<Table.Cell>Curso</Table.Cell>
									<Table.Cell>Código</Table.Cell>
									<Table.Cell>Profesor</Table.Cell>
									<Table.Cell>Día</Table.Cell>
									<Table.Cell>Horario</Table.Cell>
									<Table.Cell>Capacidad</Table.Cell>
									<Table.Cell>Ciclo</Table.Cell>
									<Table.Cell>Créditos</Table.Cell>
									<Table.Cell>Estado</Table.Cell>
									<Table.Cell>Obligatorio</Table.Cell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{scheduleData.map((course) => (
									<Table.Row key={course.id}>
										<Table.Cell fontWeight='medium'>
											{course.course_name}
										</Table.Cell>
										<Table.Cell>{course.course_group_code}</Table.Cell>
										<Table.Cell>{course.teacher_name}</Table.Cell>
										<Table.Cell>{course.day_of_week}</Table.Cell>
										<Table.Cell>
											<HStack>
												<FiClock size={12} />
												<Text fontSize='sm'>
													{course.start_time} - {course.end_time}
												</Text>
											</HStack>
										</Table.Cell>
										<Table.Cell>
											<HStack>
												<FiUsers size={12} />
												<Text>{course.capacity}</Text>
											</HStack>
										</Table.Cell>
										<Table.Cell>
											<Badge variant='outline'>{course.cycle}</Badge>
										</Table.Cell>
										<Table.Cell>{course.credits}</Table.Cell>
										<Table.Cell>
											{getStatusBadge(
												course.status_review,
												course.status_review_display
											)}
										</Table.Cell>
										<Table.Cell>
											<Badge colorScheme={course.is_mandatory ? 'red' : 'gray'}>
												{course.is_mandatory ? 'Obligatorio' : 'Electivo'}
											</Badge>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</Box>
				</Tabs.Content>
			</Tabs.Root>
			{/* Modales Secundarios */}
		</Modal>
	);
};
