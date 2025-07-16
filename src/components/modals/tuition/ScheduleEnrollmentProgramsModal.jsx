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
	FileUpload,
	Icon,
	Span,
} from '@chakra-ui/react';

import PropTypes from 'prop-types';
import {
	FiBookOpen,
	FiCalendar,
	FiClock,
	FiDownload,
	FiFileText,
	FiGrid,
	FiList,
	FiTrash2,
	FiUsers,
} from 'react-icons/fi';
import { Alert, ConfirmModal, Field, Modal, toaster } from '@/components/ui';
import { ReactSelect } from '@/components/select';
import { useRef, useState } from 'react';
import { useReadCourseSchedule } from '@/hooks/enrollments_programs/schedule/useReadCourseSchedule';
import { LuUpload } from 'react-icons/lu';
import { useUploadCourseScheduleExcel } from '@/hooks/enrollments_programs/schedule/useUploadCourseScheduleExcel';
import { uploadToS3 } from '@/utils/uploadToS3';
import { useProccessCourseScheduleExcel } from '@/hooks/enrollments_programs/schedule/useProccessCourseScheduleExcel';
import { SendConfirmationModal } from '@/components/ui/SendConfirmationModal';
import { useCreateCourseScheduleReview } from '@/hooks/enrollments_programs/schedule/useCreateCourseScheduleReview';
import { useDeleteCourseSchedule } from '@/hooks/enrollments_programs/schedule/useDeleteCourseSchedule';

// Datos de ejemplo basados en la estructura proporcionada
/*const scheduleData = [
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
		id: 9,
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
		id: 8,
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
		id: 7,
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
];*/

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

const AddExcelScheduleModal = ({ open, setOpen, data }) => {
	const [file, setFile] = useState(null);
	const fileInputRef = useRef(null);
	const [loading, setLoading] = useState(false);

	const { mutate: uploadCourseScheduleExcel } = useUploadCourseScheduleExcel();

	const { mutate: processCourseScheduleExcel } =
		useProccessCourseScheduleExcel();
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

	const handleSubmit = async () => {
		if (!file) {
			toaster.create({
				title: 'Error',
				description: 'Por favor, selecciona un archivo antes de guardar.',
				type: 'error',
			});
			return;
		}
		setLoading(true);

		let uploadedFileUrl;

		try {
			// Subir el archivo a S3
			uploadedFileUrl = await uploadToS3(
				file,
				'sga_uni/schedule',
				'schedule_excel'
			);

			const payload = {
				schedule_excel_url: uploadedFileUrl,
			};

			// Consumir primera API: registrar URL del Excel
			uploadCourseScheduleExcel(
				{ id: data.id, payload },
				{
					onSuccess: () => {
						// Ejecutar segunda API automáticamente después
						processCourseScheduleExcel(
							{ id: data.id },
							{
								onSuccess: () => {
									toaster.create({
										title: 'Éxito',
										description:
											'El cronograma se ha importado y procesado correctamente.',
										type: 'success',
									});
									setOpen(false);
									setLoading(false);
									setFile(null);
								},
								onError: (error) => {
									toaster.create({
										title: 'Error al procesar',
										description:
											error.message || 'No se pudo procesar el cronograma.',
										type: 'error',
									});
									setLoading(false);
								},
							}
						);
					},
					onError: (error) => {
						toaster.create({
							title: 'Error',
							description: error.message || 'Error al importar el cronograma.',
							type: 'error',
						});
						setLoading(false);
					},
				}
			);
		} catch (error) {
			toaster.create({
				title: 'Error',
				description: error.message || 'Error al subir el archivo.',
				type: 'error',
			});
			setLoading(false);
		}
	};
	const handleDownloadGuide = () => {
		// Crear un enlace temporal para descargar el archivo
		const link = document.createElement('a');
		link.href = '/templates/Carga-de-Horarios.xlsx'; // Archivo en la carpeta public
		link.download = 'Carga-de-Horarios.xlsx';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toaster.create({
			title: 'Descarga completa',
			description: 'La guía del cronograma se descargó correctamente.',
			type: 'success',
			duration: 3000,
			isClosable: true,
		});
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
			size='xl'
			loading={loading}
			loadingText='Subiendo...'
			onSave={handleSubmit}
		>
			<VStack spacing={4}>
				<Field label='Archivo Excel'>
					<FileUpload.Root required maxW='xl' alignItems='stretch' maxFiles={1}>
						<FileUpload.HiddenInput
							ref={fileInputRef}
							onChange={handleFileChange}
						/>
						<FileUpload.Dropzone>
							<Icon size='md' color='fg.muted'>
								<LuUpload />
							</Icon>
							<FileUpload.DropzoneContent>
								<Box>Arrastra y suelta tu archivo Excel aquí</Box>
								<Box color='fg.muted'>.xlsx o .xls</Box>
							</FileUpload.DropzoneContent>
						</FileUpload.Dropzone>
						<FileUpload.List />
					</FileUpload.Root>
				</Field>

				<Alert
					status='info'
					borderRadius='lg'
					bg='blue.50'
					borderColor='blue.200'
					borderWidth={1}
					title='Requisitos del archivo:'
				>
					<VStack align='start' spacing={1}>
						<Text>• Formato requerido: .xlsx o .xls</Text>
						<Text>
							• Columnas: Descargar Guía de formato correcto
						</Text>
						<Text>• Primera fila debe contener los encabezados</Text>
					</VStack>
				</Alert>

				<Box
					bg='gray.50'
					p={4}
					w={'full'}
					borderRadius='lg'
					border='1px solid'
					borderColor='gray.200'
				>
					<HStack justify='space-between' align='center'>
						<HStack gap={3}>
							<Box
								w={8}
								h={8}
								bg='green.100'
								borderRadius='full'
								display='flex'
								alignItems='center'
								justifyContent='center'
							>
								<FiFileText color='green.600' size={16} />
							</Box>
							<Box>
								<Text fontSize='sm' fontWeight='medium' color='gray.800'>
									Plantilla de ejemplo
								</Text>
								<Text fontSize='xs' color='gray.600'>
									Descarga la guía con formato correcto
								</Text>
							</Box>
						</HStack>

						<Button
							colorPalette='green'
							variant='solid'
							onClick={handleDownloadGuide}
							borderRadius='lg'
						>
							<FiDownload /> Descargar guía
						</Button>
					</HStack>
				</Box>
			</VStack>
		</Modal>
	);
};

AddExcelScheduleModal.propTypes = {
	open: PropTypes.bool.isRequired,
	setOpen: PropTypes.func.isRequired,
	data: PropTypes.shape({
		id: PropTypes.number.isRequired,
	}).isRequired,
};

const CalendarView = ({ data }) => {
	const headerBg = 'gray.50';
	const bgDraft = 'blue.100';
	const bgPending = 'yellow.100';
	const bgApproved = 'green.100';

	const borderDraft = 'blue.500';
	const borderPending = 'yellow.500';
	const borderApproved = 'green.500';

	const getBgColor = (status) => {
		if (status === 1) return bgDraft;
		if (status === 2) return bgPending;
		if (status === 4) return bgApproved;
		return 'gray.100'; // fallback
	};

	const getBorderColor = (status) => {
		if (status === 1) return borderDraft;
		if (status === 2) return borderPending;
		if (status === 4) return borderApproved;
		return 'gray.300'; // fallback
	};

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
												bg={getBgColor(course.status_review)}
												borderLeftColor={getBorderColor(course.status_review)}
												borderLeft='4px solid'
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
													bg: getBgColor(course.status_review).replace(
														'.100',
														'.200'
													),
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
												<HStack gap={1} mt={1} justifyContent={'space-between'}>
													{/*<HStack>
														<FiUsers size={12} />
														<Text fontSize='xs'>{course.capacity}</Text>
													</HStack>*/}
													<HStack>
														<Text fontSize='xs'>Ciclo: {course.cycle}</Text>
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

export const ScheduleEnrollmentProgramsModal = ({ data }) => {
	const [open, setOpen] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [openSend, setOpenSend] = useState(false);
	const [addCourseOpen, setAddCourseOpen] = useState(false);
	const [addExcelOpen, setAddExcelOpen] = useState(false);
	const [tab, setTab] = useState(1);

	const {
		data: dataCourseSchedule,
		//isLoading: loadingPaymentOrders,
		refetch: fetchDataCourseSchedule,
	} = useReadCourseSchedule(
		{ enrollment_period_program_course: data.id },
		{ enabled: open }
	);

	const scheduleData = dataCourseSchedule?.results || [];

	const dayNames = [
		'Domingo',
		'Lunes',
		'Martes',
		'Miércoles',
		'Jueves',
		'Viernes',
		'Sábado',
	];

	const normalizedData = scheduleData.map((item) => ({
		...item,
		day_of_week: dayNames[item.day_of_week],
	}));

	const getStatusBadge = (status, statusDisplay) => {
		let colorScheme = 'gray';

		if (status === 1)
			colorScheme = 'blue'; // Borrador
		else if (status === 2)
			colorScheme = 'yellow'; // Pendiente
		else if (status === 3)
			colorScheme = 'red'; // Rechazado
		else if (status === 4) colorScheme = 'green'; // Aprobado

		return <Badge colorPalette={colorScheme}>{statusDisplay}</Badge>;
	};

	const { mutate: createCourseReview, isPending: LoadingProgramsReview } =
		useCreateCourseScheduleReview();

	const handleSend = (course) => {
		createCourseReview(course.id, {
			onSuccess: () => {
				toaster.create({
					title: 'Horario enviado correctamente',
					type: 'success',
				});
				fetchDataCourseSchedule();
				setOpenSend(false);
			},
			onError: (error) => {
				console.log(error);
				toaster.create({
					title: error.message,
					type: 'error',
				});
			},
		});
	};

	const { mutate: deleteCourseSchedule, isPending } = useDeleteCourseSchedule();

	const handleDelete = (course) => {
		deleteCourseSchedule(course.id, {
			onSuccess: () => {
				toaster.create({
					title: 'Curso eliminado correctamente',
					type: 'success',
				});
				fetchDataCourseSchedule();
				setOpenDelete(false);
			},
			onError: (error) => {
				toaster.create({
					title: error.message,
					type: 'error',
				});
			},
		});
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
				<AddExcelScheduleModal
					data={data}
					open={addExcelOpen}
					setOpen={setAddExcelOpen}
				/>
			</HStack>

			<Grid
				templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
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
				{/*<Card.Root>
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
				</Card.Root>*/}
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
								scheduleData.filter((course) => course.status_review === 4)
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
					<CalendarView data={normalizedData} />
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
									<Table.Cell>Acciones</Table.Cell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{scheduleData?.length > 0 ? (
									scheduleData.map((course) => (
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
												<Badge
													colorPalette={course.is_mandatory ? 'red' : 'gray'}
												>
													{course.is_mandatory ? 'Obligatorio' : 'Electivo'}
												</Badge>
											</Table.Cell>
											<Table.Cell>
												<HStack>
													<SendConfirmationModal
														item={course}
														onConfirm={() => handleSend(course)}
														openSend={openSend}
														setOpenSend={setOpenSend}
														loading={LoadingProgramsReview}
													/>

													<ConfirmModal
														placement='center'
														trigger={
															<IconButton
																disabled={
																	course.status_review === 2 ||
																	course.status_review === 4
																}
																colorPalette='red'
																size='xs'
															>
																<FiTrash2 />
															</IconButton>
														}
														open={openDelete}
														onOpenChange={(e) => setOpenDelete(e.open)}
														onConfirm={() => handleDelete(course)}
														loading={isPending}
													>
														<Text>
															¿Estás seguro que quieres eliminar a
															<Span fontWeight='semibold' px='1'>
																{course.course_name}
															</Span>
															de la lista de ubigeos?
														</Text>
													</ConfirmModal>
												</HStack>
											</Table.Cell>
										</Table.Row>
									))
								) : (
									<Table.Row>
										<Table.Cell colSpan={11} textAlign='center' py={2}>
											No hay datos disponibles.
										</Table.Cell>
									</Table.Row>
								)}
							</Table.Body>
						</Table.Root>
					</Box>
				</Tabs.Content>
			</Tabs.Root>
			{/* Modales Secundarios */}
		</Modal>
	);
};

ScheduleEnrollmentProgramsModal.propTypes = {
	data: PropTypes.shape({
		id: PropTypes.number.isRequired,
	}).isRequired,
};
