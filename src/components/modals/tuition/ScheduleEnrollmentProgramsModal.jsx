import {
	Button,
	Box,
	Text,
	Grid,
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
	SimpleGrid,
} from '@chakra-ui/react';

import PropTypes from 'prop-types';
import {
	FiBookOpen,
	FiCalendar,
	FiCheckCircle,
	FiClock,
	FiDownload,
	FiFileText,
	FiGrid,
	FiList,
	FiPlus,
	FiSend,
	FiTrash2,
	FiUsers,
	FiXCircle,
} from 'react-icons/fi';
import {
	Alert,
	Checkbox,
	ConfirmModal,
	Field,
	Modal,
	Pagination,
	Radio,
	RadioGroup,
	toaster,
} from '@/components/ui';
import { ReactSelect } from '@/components/select';
import { useRef, useState } from 'react';
import { useReadCourseSchedule } from '@/hooks/enrollments_programs/schedule/useReadCourseSchedule';
import { LuUpload } from 'react-icons/lu';
import { useUploadCourseScheduleExcel } from '@/hooks/enrollments_programs/schedule/useUploadCourseScheduleExcel';
import { uploadToS3 } from '@/utils/uploadToS3';
import { useProccessCourseScheduleExcel } from '@/hooks/enrollments_programs/schedule/useProccessCourseScheduleExcel';
//import { SendConfirmationModal } from '@/components/ui/SendConfirmationModal';
//import { useCreateCourseScheduleReview } from '@/hooks/enrollments_programs/schedule/useCreateCourseScheduleReview';
import { useDeleteCourseSchedule } from '@/hooks/enrollments_programs/schedule/useDeleteCourseSchedule';
import { FaClock, FaGraduationCap } from 'react-icons/fa';
import { useReadUsers } from '@/hooks/users';
import { useCreateCourseSchedule } from '@/hooks/enrollments_programs/schedule/useCreateCourseSchedule';
import { HistoryStatusCourseSheduleView } from '@/components/forms/enrollment_proccess/HistoryStatusCourseSheduleView';
import { usePaginatedInfiniteData } from '@/components/navigation';
import useSortedData from '@/utils/useSortedData';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import { SortableHeader } from '@/components/ui/SortableHeader';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { useCreateCourseScheduleReviewMasive } from '@/hooks/enrollments_programs/schedule/useCreateCourseScheduleReviewMasive';
import { useReadCurriculumMaps } from '@/hooks/curriculum_maps';
import { useReadCurriculumMapsCourses } from '@/hooks/curriculum_maps_courses';
import { useDeleteCourseGroups } from '@/hooks/course_groups';
import { useReadScheduleTypes } from '@/hooks/schedule_types';
import { ScheduleEnrollmentCoursesPdf } from '.';

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
	'20:00',
	'21:00',
	'22:00',
	'23:00',
];

const daysOfWeek = [
	'Lunes',
	'Martes',
	'Miércoles',
	'Jueves',
	'Viernes',
	'Sábado',
	'Domingo',
];

const daysOfWeek2 = [
	{ label: 'L', fullName: 'Lunes', value: '1' },
	{ label: 'M', fullName: 'Martes', value: '2' },
	{ label: 'M', fullName: 'Miércoles', value: '3' },
	{ label: 'J', fullName: 'Jueves', value: '4' },
	{ label: 'V', fullName: 'Viernes', value: '5' },
	{ label: 'S', fullName: 'Sábado', value: '6' },
	{ label: 'D', fullName: 'Domingo', value: '7' },
];

const AddCourseModal = ({ open, setOpen, data, fetchData }) => {
	const [formData, setFormData] = useState({
		course_id: null,
		prerequisite_ids: [],
		is_mandatory: true,
		cycle: '',
		credits: '',
		group_code: '',
		teacher_id: '',
		capacity: '',
		schedules: [{ day_of_week: null, start_time: '', end_time: '' }],
    type_schedule: null,
    credits_per_group: null,
	});

  // function calcMaxCreditsPerGroup() {
  //   if (!formData?.group_code) return;
  //   // Suma los créditos usados en ese grupo
  //   const credits_used = allCourseGroups
  //     ?.filter((g) => g.course_group_code === formData?.group_code)
  //     ?.reduce((sum, g) => sum + (g.credits_per_group || 0), 0) || 0;
  //   // Devuelve la resta entre los créditos del curso y los usados
  //   console.log((formData.credits || 0) - credits_used);
  //   return (formData.credits || 0) - credits_used;
  // }

  const { data: dataTypeSchedules, isLoading: isLoadingTypeSchedules } = useReadScheduleTypes();

  const TypeSchedulesOptions = 
    dataTypeSchedules?.results
      ?.filter((item) => item.enabled)
      ?.map((item) => ({
        label: item?.name,
        value: item?.id,
      })) 

	const [errors, setErrors] = useState({});
	const { data: dataUsers } = useReadUsers(
		{},
		{
			enabled: open,
		}
	);

  const { data: curriculumMap } = useReadCurriculumMaps(
    { program: data?.program, is_current: true },
		{
			enabled: open && !!data?.program,
		}
  )

  const curriculumMapId = curriculumMap?.results?.[0]?.id;

  const { data: dataCurriculumMapCourses } = useReadCurriculumMapsCourses(
    { curriculum_map: curriculumMapId },
    { enabled: !!curriculumMapId }
  );

	const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);

	const validateFields = () => {
		const newErrors = {};
    //const maxCreditsPerGroup = calcMaxCreditsPerGroup();

		if (!formData.course_id) newErrors.course_id = 'El curso es requerido';
		if (!formData.group_code)
			newErrors.group_code = 'El código de grupo es requerido';
		if (!formData.teacher_id) newErrors.teacher_id = 'El docente es requerido';
		if (!formData.credits) newErrors.credits = 'Los créditos son requeridos';
		if (!formData.cycle) newErrors.cycle = 'El ciclo es requerido';
		if (!formData.capacity) newErrors.capacity = 'La capacidad es requerida';
    if (!formData.type_schedule) newErrors.type_schedule = 'El tipo de horario es requerido';
		if (!formData.schedules?.length)
			newErrors.schedules = 'Debe agregar al menos un horario';

    if (!dataTypeSchedules?.results?.find((ts) => ts?.id === formData?.type_schedule)?.is_single && !formData.credits_per_group) newErrors.credits_per_group = 'La cantidad de créditos por grupo es requerido'
    // if (
    //   formData.credits_per_group < 0 &&
    //   formData.credits_per_group > maxCreditsPerGroup
    // ) newErrors.credits_per_group = `La cantidad de créditos por grupo debe ser entre 1 y ${maxCreditsPerGroup}`

		if (formData.schedules?.[0]) {
			if (!formData.schedules[0].day_of_week)
				newErrors.day_of_week = 'El día es requerido';
			if (!formData.schedules[0].start_time)
				newErrors.start_time = 'La hora de inicio es requerida';
			if (!formData.schedules[0].end_time)
				newErrors.end_time = 'La hora de fin es requerida';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Usar dataCurriculumMapCourses para las opciones de cursos
	const coursesOptions =
		dataCurriculumMapCourses?.results?.map((course) => ({
			value: course.id, // id del curso X -> Id del curriculum map course
			label: `${course.course_name} (${course.course_code})`,
			credits: course.credits,
			cycle: course.cycle,
			is_mandatory: course.is_mandatory,
			prerequisite: course.prerequisite,
			course_code: course.course_code,
			curriculum_map_course_id: course.id,
		})) || [];

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

	const updateSchedule = (index, field, value) => {
		const updated = [...formData.schedules];
		updated[index][field] = value;
		setFormData((prev) => ({
			...prev,
			schedules: updated,
		}));
	};

	const addSchedule = () => {
		setFormData((prev) => ({
			...prev,
			schedules: [
				...prev.schedules,
				{ day_of_week: null, start_time: '', end_time: '' },
			],
		}));
	};

	const removeSchedule = (index) => {
		setFormData((prev) => ({
			...prev,
			schedules: prev.schedules.filter((_, i) => i !== index),
		}));
	};

	const { mutate: createCourseSchedule, isPending } = useCreateCourseSchedule();

	const handleSubmit = () => {
		if (!validateFields()) {
			return;
		}

		const payload = {
			enrollment_period_id: data.enrollment_period,
			enrollment_program_id: data.id,
			course_id: formData.course_id,
			//prerequisite_ids: formData.prerequisite_ids,
			//is_mandatory: formData.is_mandatory,
			//cycle: formData.cycle,
			//credits: parseInt(formData.credits),
			group_code: formData.group_code,
			teacher_id: parseInt(formData.teacher_id),
			capacity: parseInt(formData.capacity),
			schedules: formData.schedules.map((schedule) => ({
				day_of_week: parseInt(schedule.day_of_week),
				start_time: schedule.start_time,
				end_time: schedule.end_time,
			})),
      type_schedule: formData?.type_schedule,
      credits_per_group: formData?.credits_per_group
		};

    if (!dataTypeSchedules?.results?.find((ts) => ts?.id === formData?.type_schedule)?.is_single) {
      payload.credits_per_group = formData?.credits_per_group
    }

		createCourseSchedule(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Curso agregado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
			},
			onError: (error) => {
				const backendError =
					error.response?.data?.error || error.message || 'Error desconocido'
				toaster.create({
					title: 'Error al agregar curso',
					description: backendError,
					type: 'error',
				});
			},
		});
	};

	const DocenteOption = dataUsers?.results
		?.filter(
			(c) =>
				c?.is_active === true &&
				Array.isArray(c?.roles) &&
				c.roles.some((role) => role?.name === 'Docente')
		)
		?.map((c) => ({
			value: c.id.toString(),
			label: c.full_name,
		}));


	return (
		<Modal
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			trigger={
				<Box>
					<IconButton
            disabled={data?.status === 4}
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
			onSave={handleSubmit}
			loading={isPending}
			size='7xl'
		>
			<VStack gap={4}>
				<Card.Root border='2px solid' borderColor='gray.200' w='full'>
					<Card.Header>
						<Heading size='md' display='flex' alignItems='center' gap={2}>
							<Icon as={FaGraduationCap} boxSize={5} color='blue.600' />
							Información Básica
						</Heading>
					</Card.Header>
					<Card.Body>
						<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
							<Field
								label='Curso:'
								required
								invalid={!!errors.course_id}
								errorText={errors.course_id}
							>
								<ReactSelect
									value={
										coursesOptions.find(
											(opt) => opt.value === formData.course_id
									) || null
									}
									onChange={(opt) => {
										if (opt) {
											setFormData((prev) => ({
												...prev,
												course_id: opt.value,
												credits: opt.credits,
												cycle: opt.cycle,
												is_mandatory: opt.is_mandatory,
												prerequisite_ids: opt.prerequisite,
											}));
											setSelectedPrerequisites(opt.prerequisite || []);
										} else {
											setFormData((prev) => ({
												...prev,
												course_id: null,
												credits: '',
												cycle: '',
												is_mandatory: true,
												prerequisite_ids: [],
											}));
											setSelectedPrerequisites([]);
										}
									}}
									options={coursesOptions}
									isClearable
									isSearchable
									placeholder='Selecciona un curso'
								/>
							</Field>

							<Field
								label='Código del grupo:'
								required
								invalid={!!errors.group_code}
								errorText={errors.group_code}
							>
								<Input
									name='group_code'
									placeholder='Ej: A1, B2, etc.'
									value={formData.group_code}
									onChange={handleInputChange}
								/>
							</Field>

							<Field
								label='Docente:'
								required
								invalid={!!errors.teacher_id}
								errorText={errors.teacher_id}
							>
								<ReactSelect
									options={DocenteOption}
									value={
										DocenteOption?.find(
											(opt) => opt.value === formData.teacher_id
										) || null
									}
									onChange={(opt) => handleSelectChange('teacher_id')(opt)}
									isClearable
									isSearchable
									placeholder='Selecciona un docente'
								/>
							</Field>

							<Field
								label='Créditos:'
								required
								invalid={!!errors.credits}
								errorText={errors.credits}
							>
								<Input
									name='credits'
									value={formData.credits}
									onChange={handleInputChange}
									type='number'
									min={1}
									disabled
                  variant="flushed"
								/>
							</Field>

							<Field
								label='Ciclo:'
								required
								invalid={!!errors.cycle}
								errorText={errors.cycle}
							>
								<Input
									name='cycle'
									placeholder='Ej: 1, 2, etc.'
									value={formData.cycle}
									onChange={handleInputChange}
									type='number'
									min={1}
									max={10}
									disabled
                  variant="flushed"
								/>
							</Field>

							<Field
								label='Capacidad:'
								required
								invalid={!!errors.capacity}
								errorText={errors.capacity}
							>
								<Input
									name='capacity'
									value={formData.capacity}
									onChange={handleInputChange}
									type='number'
									min={1}
								/>
							</Field>
              <Field
								label='Tipo de horario:'
								required
								invalid={!!errors.type_schedule}
								errorText={errors.type_schedule}
							>
								<ReactSelect
                  options={TypeSchedulesOptions}
                  loading={isLoadingTypeSchedules}
                  value={
										TypeSchedulesOptions?.find(
											(opt) => opt.value === formData.type_schedule
										) || null
									}
									onChange={(opt) => handleSelectChange('type_schedule')(opt)}
									isClearable
									isSearchable
									placeholder='Selecciona un tipo de horario'
                />
							</Field>
              {
                formData?.type_schedule &&
                dataTypeSchedules?.results &&
                !dataTypeSchedules?.results?.find((ts) => ts?.id === formData?.type_schedule)?.is_single &&
              (
                <Field
                  label='Créditos por horario:'
                  required
                  invalid={!!errors.credits_per_group}
                  errorText={errors.credits_per_group}
                >
                  <Input
                    name='credits_per_group'
                    value={formData.credits_per_group}
                    onChange={handleInputChange}
                    type='number'
                    min={1}
                  />
                </Field>
              )}
							<Field label='¿Es obligatorio?'>
								<RadioGroup value={formData.is_mandatory ? 'yes' : 'no'} isDisabled direction='row' spaceX={4}>
									<Radio value='yes'>Sí</Radio>
									<Radio value='no'>No</Radio>
								</RadioGroup>
							</Field>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>

				<Card.Root border='2px solid' borderColor='gray.200' w='full'>
					<Card.Header>
						<Flex align='center' gap={2}>
							<FiUsers size={20} className='text-green-600' />
							<Heading size='sm'>Prerrequisitos</Heading>
						</Flex>
					</Card.Header>
					<Card.Body>
						{selectedPrerequisites && selectedPrerequisites.length > 0 ? (
							<VStack align='start' spacing={1}>
								{selectedPrerequisites.map((prereq, idx) => (
									<Badge size="md" key={idx} colorPalette='blue' variant='subtle'>
										{prereq}
									</Badge>
								))}
							</VStack>
						) : (
							<Text color='gray.500'>No tiene prerrequisitos</Text>
						)}
					</Card.Body>
				</Card.Root>

				<Card.Root border='2px solid' borderColor='gray.200' w='full'>
					<Card.Header>
						<Flex align='center' gap={2}>
							<FaClock size={20} className='text-purple-600' />
							<Heading size='sm'>Horarios</Heading>
						</Flex>
					</Card.Header>
					<Card.Body>
						{formData.schedules.map((schedule, index) => (
							<Card.Root
								key={index}
								variant='outline'
								borderColor='gray.200'
								mb={4}
							>
								<Card.Body>
									<Flex justify='space-between' align='center' mb={3}>
										<Text fontWeight='medium'>Horario {index + 1}</Text>
										{formData.schedules.length > 1 && (
											<Button
												size='sm'
												colorScheme='red'
												variant='ghost'
												onClick={() => removeSchedule(index)}
											>
												<FiTrash2 size={16} />
											</Button>
										)}
									</Flex>

									<Box w='full' mb={3}>
										<Text mb={1} fontWeight='medium' fontSize='sm'>
											Día de la semana
										</Text>
										<Flex wrap='wrap' gap={2} w='full'>
											{daysOfWeek2.map((day) => (
												<Button
													key={day.value}
													size='sm'
													variant={
														schedule.day_of_week === day.value
															? 'solid'
															: 'outline'
													}
													colorScheme='purple'
													onClick={() =>
														updateSchedule(index, 'day_of_week', day.value)
													}
												>
													{day.label}
												</Button>
											))}
										</Flex>
									</Box>

									<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
										<Field
											label='Hora de inicio'
											required
											invalid={!!errors.start_time}
											errorText={errors.start_time}
										>
											<Input
												type='time'
												value={schedule.start_time}
												onChange={(e) =>
													updateSchedule(index, 'start_time', e.target.value)
												}
											/>
										</Field>
										<Field
											label='Hora de fin'
											required
											invalid={!!errors.end_time}
											errorText={errors.end_time}
										>
											<Input
												type='time'
												value={schedule.end_time}
												onChange={(e) =>
													updateSchedule(index, 'end_time', e.target.value)
												}
											/>
										</Field>
									</SimpleGrid>

									{schedule.day_of_week &&
										schedule.start_time &&
										schedule.end_time && (
											<Box
												mt={3}
												bg='purple.50'
												border='1px solid'
												borderColor='purple.200'
												p={3}
												borderRadius='md'
											>
												<Text
													fontSize='sm'
													color='purple.800'
													fontWeight='medium'
												>
													📅{' '}
													{
														daysOfWeek2.find(
															(d) => d.value === schedule.day_of_week
														)?.fullName
													}{' '}
													de {schedule.start_time} a {schedule.end_time}
												</Text>
											</Box>
										)}
								</Card.Body>
							</Card.Root>
						))}
						<Button
							variant='outline'
							colorPalette='purple'
							onClick={addSchedule}
							w='full'
							borderStyle='dashed'
							borderWidth='2px'
							borderColor='purple.300'
						>
							<FiPlus size={16} /> Agregar otro horario
						</Button>
					</Card.Body>
				</Card.Root>
			</VStack>
		</Modal>
	);
};

AddCourseModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	data: PropTypes.object,
	fetchData: PropTypes.func,
  allCourseGroups: PropTypes.array,
};

const AddExcelScheduleModal = ({ open, setOpen, data, fetchData }) => {
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
				'schedule_excel',
				'xlsx'
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
									fetchData();
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
            disabled={data?.status === 4}
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
						<Text>• Columnas: Descargar Guía de formato correcto</Text>
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
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	data: PropTypes.shape({
		id: PropTypes.number,
    status: PropTypes.number,
	}),
	fetchData: PropTypes.func,
};

const CalendarView = ({ data }) => {
	const headerBg = 'gray.50';
	const bgDraft = 'blue.100';
	const bgPending = 'yellow.100';
	const bgRechazado = 'red.100';
	const bgApproved = 'green.100';

	const borderDraft = 'blue.500';
	const borderPending = 'yellow.500';
	const borderRechazado = 'red.500';
	const borderApproved = 'green.500';

	const getBgColor = (status) => {
		if (status === 1) return bgDraft;
		if (status === 2) return bgPending;
		if (status === 3) return bgRechazado;
		if (status === 4) return bgApproved;
		return 'gray.100'; // fallback
	};

	const getBorderColor = (status) => {
		if (status === 1) return borderDraft;
		if (status === 2) return borderPending;
		if (status === 3) return borderRechazado;
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
				<Grid templateColumns='auto repeat(7, 1fr)' gap={1} mb={2}>
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
					<Grid key={time} templateColumns='auto repeat(7, 1fr)' gap={1}>
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
  console.log({ data })
	const [open, setOpen] = useState(false);

	const [courseToDelete, setCourseToDelete] = useState(null);
	//const [openSend, setOpenSend] = useState(false);
	const [addCourseOpen, setAddCourseOpen] = useState(false);
	const [addExcelOpen, setAddExcelOpen] = useState(false);
	const [tab, setTab] = useState(1);

	const {
		data: dataCourseSchedule,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: isLoadingCourseSchedule,
		refetch: refetchCourseSchedule,
	} = useReadCourseSchedule(
		{ enrollment_period_program: data.id },
		{ enabled: open }
	);

	//const [selectedIds, setSelectedIds] = useState([]);
	const allCourseSchedules =
		dataCourseSchedule?.pages?.flatMap((page) => page.results) ?? [];

	const [selectedIds, setSelectedIds] = useState([]);
	const scheduleData = allCourseSchedules || [];

	const totalCount = dataCourseSchedule?.pages?.[0]?.count ?? 0;

	const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
	const [sortConfig, setSortConfig] = useState(null);

	const sortedData = useSortedData(allCourseSchedules, sortConfig);

	const { currentPage, visibleRows, loadUntilPage, setCurrentPage } =
		usePaginatedInfiniteData({
			data: sortedData,
			pageSize,
			fetchNextPage,
			hasNextPage,
			isFetchingNextPage,
		});

	const dayNames = [
		'Domingo',
		'Lunes',
		'Martes',
		'Miércoles',
		'Jueves',
		'Viernes',
		'Sábado',
	];

	const normalizedData = allCourseSchedules.map((item) => ({
		...item,
		day_of_week: dayNames[item.day_of_week],
	}));

	const { mutate: createCourseReview, isPending: LoadingProgramsReview } =
		useCreateCourseScheduleReviewMasive();

	/*const handleSend = (course) => {
		createCourseReview(course.id, {
			onSuccess: () => {
				toaster.create({
					title: 'Horario enviado correctamente',
					type: 'success',
				});
				refetchCourseSchedule();
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
	};*/

	const handleSendMultiple = async (courseIds = []) => {
		if (!courseIds.length) return;

		// Preparo el payload
		const payload = { course_schedule_ids: courseIds };

		// Llamo a la API
		createCourseReview(payload, {
			onSuccess: () => {
				toaster.create({
					title: `✅ ${courseIds.length} horario(s) enviados correctamente`,
					type: 'success',
				});
				refetchCourseSchedule();
				setSelectedIds([]);
			},
			onError: (error) => {
				console.error('Error al enviar:', error);
				toaster.create({
					title: `⚠️ Hubo un error al enviar los horarios`,
					type: 'error',
				});
			},
		});
	};

	const { mutate: deleteCourseSchedule, isPending } = useDeleteCourseSchedule();
  const { mutate: deleteCouseGroup, isPending: isDeletingGroup } = useDeleteCourseGroups();

	const handleDelete = (course) => {
		deleteCourseSchedule(course.id, {
			onSuccess: () => {
        deleteCouseGroup(course.course_group, {
          onSuccess: () => {
            toaster.create({
              title: 'Curso eliminado correctamente',
              type: 'success',
            });
            refetchCourseSchedule();
            setCourseToDelete(null);
          },
          onError: (error) => {
            toaster.create({
              title: error.message,
              type: 'error',
            });
          },
        });
			},
			onError: (error) => {
				toaster.create({
					title: error.message,
					type: 'error',
				});
			},
		});
	};

	const statusMap = {
		1: { label: 'Borrador', color: 'gray', icon: FiFileText },
		2: { label: 'Pendiente', color: 'orange.500', icon: FiClock },
		3: { label: 'Rechazado', color: 'red', icon: FiXCircle },
		4: { label: 'Aprobado', color: 'green', icon: FiCheckCircle },
	};

	return (
		<Modal
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			size='8xl'
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
			<HStack gap={3} pb={2} borderBottomWidth={1} justifyContent={'end'}>
        <ScheduleEnrollmentCoursesPdf program={data} allCourseGroups={allCourseSchedules} />
				<AddCourseModal
					data={data}
					open={addCourseOpen}
					fetchData={refetchCourseSchedule}
					setOpen={setAddCourseOpen}
          allCourseGroups={allCourseSchedules}
				/>
				<AddExcelScheduleModal
					data={data}
					open={addExcelOpen}
					setOpen={setAddExcelOpen}
					fetchData={refetchCourseSchedule}
				/>
			</HStack>

			{/*<Grid
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
			</Grid>*/}

			{/* Tabs */}
			<Tabs.Root value={tab} onValueChange={(e) => setTab(e.value)}>
				<Tabs.List as={Flex} justify='space-between' align='center' mb={3}>
					<HStack gap={4}>
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
					</HStack>

					<Button
						colorPalette='green'
						mt={2}
						size='xs'
						disabled={selectedIds.length <= 0}
						loading={LoadingProgramsReview}
						loadingText='Enviando...'
						onClick={() => handleSendMultiple(selectedIds)}
					>
						<FiSend /> Enviar {selectedIds.length} horario(s)
					</Button>
				</Tabs.List>

				<Tabs.Content value={1}>
					<CalendarView data={normalizedData} />
				</Tabs.Content>

				<Tabs.Content value={2}>
					<Box overflowX='auto'>
						<Table.Root variant='simple'>
							<Table.Header>
								<Table.Row>
									<Table.Cell>
										<Checkbox
											checked={
												selectedIds.length ===
													scheduleData.filter(
														(course) =>
															course.status_review !== 2 &&
															course.status_review !== 4
													).length && scheduleData.length > 0
											}
											indeterminate={
												selectedIds.length > 0 &&
												selectedIds.length <
													scheduleData.filter(
														(course) =>
															course.status_review !== 2 &&
															course.status_review !== 4
													).length
											}
											onChange={(e) => {
												const checked = e.target?.checked ?? e === true;
												const enabledCourses = scheduleData.filter(
													(course) =>
														course.status_review !== 2 &&
														course.status_review !== 4
												);

												if (checked) {
													setSelectedIds(
														enabledCourses.map((course) => course.id)
													);
												} else {
													setSelectedIds([]);
												}
											}}
										/>
									</Table.Cell>

									<Table.Cell>
										<SortableHeader
											label='Curso'
											columnKey='course_name'
											sortConfig={sortConfig}
											onSort={setSortConfig}
										/>
									</Table.Cell>
									<Table.Cell>
										<SortableHeader
											label='Grupo'
											columnKey='course_group_code'
											sortConfig={sortConfig}
											onSort={setSortConfig}
										/>
									</Table.Cell>
									<Table.Cell>
										<SortableHeader
											label='Profesor'
											columnKey='teacher_name'
											sortConfig={sortConfig}
											onSort={setSortConfig}
										/>
									</Table.Cell>
									<Table.Cell>
										<SortableHeader
											label='Día'
											columnKey='day_of_week'
											sortConfig={sortConfig}
											onSort={setSortConfig}
										/>
									</Table.Cell>
									<Table.Cell>
										<SortableHeader
											label='Horario'
											columnKey='start_time'
											sortConfig={sortConfig}
											onSort={setSortConfig}
										/>
									</Table.Cell>
									<Table.Cell>
										<SortableHeader
											label='Capacidad'
											columnKey='capacity'
											sortConfig={sortConfig}
											onSort={setSortConfig}
										/>
									</Table.Cell>
									<Table.Cell>
										<SortableHeader
											label='Ciclo'
											columnKey='cycle'
											sortConfig={sortConfig}
											onSort={setSortConfig}
										/>
									</Table.Cell>
									<Table.Cell>
										<SortableHeader
											label='Créditos'
											columnKey='credits'
											sortConfig={sortConfig}
											onSort={setSortConfig}
										/>
									</Table.Cell>
									<Table.Cell>
										<SortableHeader
											label='Estado'
											columnKey='status_review'
											sortConfig={sortConfig}
											onSort={setSortConfig}
										/>
									</Table.Cell>
									<Table.Cell>
										<SortableHeader
											label='Obligatorio'
											columnKey='is_mandatory'
											sortConfig={sortConfig}
											onSort={setSortConfig}
										/>
									</Table.Cell>
									<Table.Cell>Acciones</Table.Cell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{isLoadingCourseSchedule ||
								(isFetchingNextPage && hasNextPage) ? (
									<SkeletonTable columns={4} />
								) : visibleRows?.length > 0 ? (
									visibleRows.map((course) => (
										<Table.Row key={course.id}>
											<Table.Cell>
												<Checkbox
													checked={selectedIds.includes(course.id)}
													onChange={(e) => {
														const checked = e.target.checked;
														setSelectedIds((prev) =>
															checked
																? [...prev, course.id]
																: prev.filter((id) => id !== course.id)
														);
													}}
													disabled={
														course.status_review === 2 ||
														course.status_review === 4
													}
												/>
											</Table.Cell>
											<Table.Cell fontWeight='medium'>
												{course.course_name}
											</Table.Cell>
											<Table.Cell>{course.course_group_code}</Table.Cell>
											<Table.Cell>{course.teacher_name}</Table.Cell>
											<Table.Cell>
												{daysOfWeek2.find(
													(day) => day.value === String(course.day_of_week)
												)?.fullName ?? course.day_of_week}
											</Table.Cell>
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
												<HistoryStatusCourseSheduleView
													data={course}
													statusMap={statusMap}
													fetchData={refetchCourseSchedule}
												/>
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
													{/*<SendConfirmationModal
														item={course}
														onConfirm={() => handleSend(course)}
														openSend={openSend}
														setOpenSend={setOpenSend}
														loading={LoadingProgramsReview}
													/>*/}

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
																onClick={() => setCourseToDelete(course)} // 👈 guardas cuál
															>
																<FiTrash2 />
															</IconButton>
														}
														open={courseToDelete?.id === course.id} // 👈 solo abre el modal de ese curso
														onOpenChange={(e) => {
															if (!e.open) setCourseToDelete(null); // 👈 cerrar limpia el estado
														}}
														onConfirm={() => handleDelete(courseToDelete)}
														loading={isPending || isDeletingGroup}
													>
														<Text>
															¿Estás seguro que quieres eliminar a
															<Span fontWeight='semibold' px='1'>
																{courseToDelete?.course_name}
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
						<Pagination
							count={totalCount}
							pageSize={pageSize}
							currentPage={currentPage}
							pageSizeOptions={pageSizeOptions}
							onPageChange={loadUntilPage}
							onPageSizeChange={(size) => {
								setPageSize(size);
								setCurrentPage(1);
							}}
						/>
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
